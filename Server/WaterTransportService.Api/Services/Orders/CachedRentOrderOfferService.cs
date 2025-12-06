using WaterTransportService.Api.Caching;
using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Декоратор сервиса откликов на заказы аренды с кешированием.
/// </summary>
public class CachedRentOrderOfferService : IRentOrderOfferService
{
    private readonly IRentOrderOfferService _innerService;
    private readonly ICacheService _cache;
    private readonly ILogger<CachedRentOrderOfferService> _logger;

    public CachedRentOrderOfferService(
        IRentOrderOfferService innerService,
        ICacheService cache,
        ILogger<CachedRentOrderOfferService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _logger = logger;
    }

    #region Read Methods (с кешированием)

    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByRentOrderIdAsync(Guid rentOrderId)
    {
        var cacheKey = CacheKeys.OffersByOrderId(rentOrderId);
        
        var cached = await _cache.GetAsync<List<RentOrderOfferDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = (await _innerService.GetOffersByRentOrderIdAsync(rentOrderId)).ToList();
        
        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.OrderOffers);
        }
        
        return result;
    }

    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByUser(Guid userId)
    {
        var cacheKey = CacheKeys.OffersForUserOrdersByStatus(userId, "Pending");
        
        var cached = await _cache.GetAsync<List<RentOrderOfferDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = (await _innerService.GetOffersByUser(userId)).ToList();
        
        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.OrderOffers);
        }
        
        return result;
    }

    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByPartnerIdAsync(Guid partnerId)
    {
        var cacheKey = CacheKeys.OffersByPartnerId(partnerId);
        
        var cached = await _cache.GetAsync<List<RentOrderOfferDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = (await _innerService.GetOffersByPartnerIdAsync(partnerId)).ToList();
        
        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.PartnerOffers);
        }
        
        return result;
    }

    public async Task<RentOrderOfferDto?> GetOfferByIdAsync(Guid id)
    {
        var cacheKey = CacheKeys.OfferById(id);
        
        var cached = await _cache.GetAsync<RentOrderOfferDto>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        var result = await _innerService.GetOfferByIdAsync(id);
        
        if (result != null)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.OrderOffers);
        }
        
        return result;
    }

    #endregion

    #region Write Methods (с инвалидацией кеша)

    public async Task<RentOrderOfferDto?> CreateOfferAsync(CreateRentOrderOfferDto createDto, Guid partnerId)
    {
        var result = await _innerService.CreateOfferAsync(createDto, partnerId);
        
        if (result != null)
        {
            await InvalidateOfferCaches(result);
            
            // Инвалидируем доступные заявки для этого партнера
            await _cache.RemoveAsync(CacheKeys.AvailableOrdersForPartner(partnerId));
            
            // Инвалидируем кеши заявки (статус может измениться на "HasOffers")
            await _cache.RemoveAsync(CacheKeys.OrderById(result.RentOrderId));
            
            // Нужно инвалидировать кеши заказа - запрашиваем его чтобы получить userId
            // (т.к. в DTO отклика нет вложенного RentOrder)
            
            _logger.LogInformation("Cache invalidated after creating offer {OfferId} for order {OrderId}", 
                result.Id, result.RentOrderId);
        }
        
        return result;
    }

    public async Task<bool> AcceptOfferAsync(Guid rentOrderId, Guid offerId)
    {
        var offer = await _innerService.GetOfferByIdAsync(offerId);
        var success = await _innerService.AcceptOfferAsync(rentOrderId, offerId);
        
        if (success && offer != null)
        {
            await InvalidateOfferCaches(offer);
            
            // Инвалидируем все отклики на эту заявку (они все стали неактуальными)
            await _cache.RemoveAsync(CacheKeys.OffersByOrderId(rentOrderId));
            
            // Инвалидируем кеши заявки
            await _cache.RemoveAsync(CacheKeys.OrderById(rentOrderId));
            
            // Инвалидируем доступные заявки (заявка больше не доступна)
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
            
            // Инвалидируем кеши партнера
            await _cache.RemoveByPrefixAsync(CacheKeys.AllPartnerOrdersPrefix(offer.PartnerId));
            
            // Инвалидируем все кеши откликов (т.к. не знаем userId без доп. запроса)
            await _cache.RemoveByPrefixAsync("rent-order-offers:user:");
            
            _logger.LogInformation("Cache invalidated after accepting offer {OfferId} for order {OrderId}", 
                offerId, rentOrderId);
        }
        
        return success;
    }

    public async Task<bool> RejectOfferAsync(Guid id)
    {
        var offer = await _innerService.GetOfferByIdAsync(id);
        var success = await _innerService.RejectOfferAsync(id);
        
        if (success && offer != null)
        {
            await InvalidateOfferCaches(offer);
            
            _logger.LogInformation("Cache invalidated after rejecting offer {OfferId}", id);
        }
        
        return success;
    }

    public async Task<bool> DeleteOfferAsync(Guid id)
    {
        var offer = await _innerService.GetOfferByIdAsync(id);
        var success = await _innerService.DeleteOfferAsync(id);
        
        if (success && offer != null)
        {
            await InvalidateOfferCaches(offer);
            
            // Инвалидируем кеши заявки (количество откликов изменилось)
            await _cache.RemoveAsync(CacheKeys.OrderById(offer.RentOrderId));
            
            _logger.LogInformation("Cache invalidated after deleting offer {OfferId}", id);
        }
        
        return success;
    }

    #endregion

    #region Private Helpers

    /// <summary>
    /// Инвалидировать все кеши, связанные с откликом.
    /// </summary>
    private async Task InvalidateOfferCaches(RentOrderOfferDto offer)
    {
        // 1. Кеш конкретного отклика
        await _cache.RemoveAsync(CacheKeys.OfferById(offer.Id));
        
        // 2. Все отклики на заявку
        await _cache.RemoveAsync(CacheKeys.OffersByOrderId(offer.RentOrderId));
        
        // 3. Все отклики партнера
        await _cache.RemoveAsync(CacheKeys.OffersByPartnerId(offer.PartnerId));
        
        // 4. Отклики на заявки пользователя (инвалидируем все т.к. не знаем userId)
        await _cache.RemoveByPrefixAsync("rent-order-offers:user:");
    }

    #endregion
}
