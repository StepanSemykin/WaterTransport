using WaterTransportService.Api.Caching;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Декоратор сервиса заказов аренды с кешированием.
/// </summary>
public class CachedRentOrderService : IRentOrderService
{
    private readonly IRentOrderService _innerService;
    private readonly ICacheService _cache;
    private readonly ILogger<CachedRentOrderService> _logger;

    public CachedRentOrderService(
        IRentOrderService innerService,
        ICacheService cache,
        ILogger<CachedRentOrderService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _logger = logger;
    }

    #region Read Methods (с кешированием)

    public async Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        // GetAllAsync не кешируем (редко используется, в основном в админке)
        return await _innerService.GetAllAsync(page, pageSize);
    }

    public async Task<RentOrderDto?> GetByIdAsync(Guid id)
    {
        var cacheKey = CacheKeys.OrderById(id);
        
        var cached = await _cache.GetAsync<RentOrderDto>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = await _innerService.GetByIdAsync(id);
        
        if (result != null)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.OrderById);
        }
        
        return result;
    }

    public async Task<RentOrderDto?> GetActiveOrderForUserAsync(Guid userId)
    {
        var cacheKey = CacheKeys.ActiveOrderForUser(userId);
        
        var cached = await _cache.GetAsync<RentOrderDto>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = await _innerService.GetActiveOrderForUserAsync(userId);
        
        if (result != null)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.ActiveOrder);
        }
        
        return result;
    }

    public async Task<IEnumerable<AvailableRentOrderDto>> GetAvailableOrdersForPartnerAsync(Guid partnerId)
    {
        var cacheKey = CacheKeys.AvailableOrdersForPartner(partnerId);
        
        var cached = await _cache.GetAsync<List<AvailableRentOrderDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = (await _innerService.GetAvailableOrdersForPartnerAsync(partnerId)).ToList();
        
        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.AvailableOrders);
        }
        
        return result;
    }

    public async Task<IEnumerable<RentOrderDto>> GetForUserByStatusAsync(string status, Guid id)
    {
        var cacheKey = CacheKeys.UserOrdersByStatus(id, status);
        var ttl = CacheTTL.GetTTLByStatus(status);
        
        var cached = await _cache.GetAsync<List<RentOrderDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = (await _innerService.GetForUserByStatusAsync(status, id)).ToList();
        
        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, ttl);
        }
        
        return result;
    }

    public async Task<IEnumerable<RentOrderDto>> GetForPartnerByStatusAsync(string status, Guid id)
    {
        var cacheKey = CacheKeys.PartnerOrdersByStatus(id, status);
        var ttl = CacheTTL.GetTTLByStatus(status);
        
        var cached = await _cache.GetAsync<List<RentOrderDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = (await _innerService.GetForPartnerByStatusAsync(status, id)).ToList();
        
        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, ttl);
        }
        
        return result;
    }

    #endregion

    #region Write Methods (с инвалидацией кеша)

    public async Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto, Guid userId)
    {
        var result = await _innerService.CreateAsync(dto, userId);
        
        if (result != null)
        {
            // Инвалидируем кеши:
            // 1. Все доступные заявки для всех партнеров
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
            
            // 2. Все кеши пользователя
            await _cache.RemoveByPrefixAsync(CacheKeys.AllUserOrdersPrefix(userId));
            
            _logger.LogInformation("Cache invalidated after creating order {OrderId} for user {UserId}", 
                result.Id, userId);
        }
        
        return result;
    }

    public async Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto)
    {
        var result = await _innerService.UpdateAsync(id, dto);
        
        if (result != null)
        {
            await InvalidateOrderCaches(result);
            
            _logger.LogInformation("Cache invalidated after updating order {OrderId}", id);
        }
        
        return result;
    }

    public async Task<bool> CompleteOrderAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.CompleteOrderAsync(id);
        
        if (success && order != null)
        {
            await InvalidateOrderCaches(order);
            
            _logger.LogInformation("Cache invalidated after completing order {OrderId}", id);
        }
        
        return success;
    }

    public async Task<bool> CancelOrderAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.CancelOrderAsync(id);
        
        if (success && order != null)
        {
            await InvalidateOrderCaches(order);
            
            // Дополнительно инвалидируем доступные заявки (заявка больше не доступна)
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
            
            _logger.LogInformation("Cache invalidated after cancelling order {OrderId}", id);
        }
        
        return success;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.DeleteAsync(id);
        
        if (success && order != null)
        {
            await InvalidateOrderCaches(order);
            
            // Инвалидируем доступные заявки
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
            
            _logger.LogInformation("Cache invalidated after deleting order {OrderId}", id);
        }
        
        return success;
    }

    #endregion

    #region Private Helpers

    /// <summary>
    /// Инвалидировать все кеши, связанные с заявкой.
    /// </summary>
    private async Task InvalidateOrderCaches(RentOrderDto order)
    {
        // 1. Кеш конкретной заявки
        await _cache.RemoveAsync(CacheKeys.OrderById(order.Id));
        
        // 2. Все кеши пользователя
        await _cache.RemoveByPrefixAsync(CacheKeys.AllUserOrdersPrefix(order.UserId));
        
        // 3. Если есть партнер - его кеши
        if (order.PartnerId.HasValue)
        {
            await _cache.RemoveByPrefixAsync(CacheKeys.AllPartnerOrdersPrefix(order.PartnerId.Value));
        }
        
        // 4. Если статус "ожидает откликов" - инвалидируем доступные заявки
        if (order.Status == RentOrderStatus.AwaitingPartnerResponse || 
            order.Status == RentOrderStatus.HasOffers)
        {
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
        }
    }

    #endregion
}
