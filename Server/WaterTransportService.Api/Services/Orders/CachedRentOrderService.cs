using WaterTransportService.Api.Caching;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Декоратор сервиса заказов аренды с кешированием.
/// </summary>
public class CachedRentOrderService(
    IRentOrderService innerService,
    ICacheService cache) : IRentOrderService
{
    private readonly IRentOrderService _innerService = innerService;
    private readonly ICacheService _cache = cache;

    #region Read Methods (с кешированием)

    #region Read Methods (с кешированием)

    /// <summary>
    /// Получить список всех заказов аренды с пагинацией.
    /// Не кешируется, так как используется редко (в основном в админ-панели).
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком заказов и общим количеством.</returns>
    public async Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        // GetAllAsync не кешируем (редко используется, в основном в админке)
        return await _innerService.GetAllAsync(page, pageSize);
    }

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// Результат кешируется на время, определенное в CacheTTL.OrderById.
    /// </summary>
    /// <param name="id">Идентификатор заказа.</param>
    /// <returns>Заказ аренды или null, если не найден.</returns>
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

    /// <summary>
    /// Получить активный заказ аренды для пользователя.
    /// Активным считается заказ со статусом AwaitingPartnerResponse или HasOffers.
    /// Результат кешируется на короткое время для активных заказов.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Активный заказ или null, если нет активных заказов.</returns>
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

    /// <summary>
    /// Получить доступные заказы для партнера с подходящими суднами.
    /// Фильтрует заказы по порту, типу судна и вместимости.
    /// Результат кешируется, но инвалидируется при создании/изменении заказов.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Список доступных заказов с подходящими суднами.</returns>
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

    /// <summary>
    /// Получить заказы пользователя по статусу.
    /// Время кеширования зависит от статуса (завершенные кешируются дольше).
    /// </summary>
    /// <param name="status">Статус заказа (например, "Completed", "Cancelled").</param>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>Список заказов с указанным статусом.</returns>
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

    /// <summary>
    /// Получить заказы партнера по статусу.
    /// Время кеширования зависит от статуса (завершенные кешируются дольше).
    /// </summary>
    /// <param name="status">Статус заказа (например, "Agreed", "Completed").</param>
    /// <param name="id">Идентификатор партнера.</param>
    /// <returns>Список заказов с указанным статусом.</returns>
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

    /// <summary>
    /// Создать новый заказ аренды.
    /// При создании инвалидируются все доступные заявки для партнеров и кеши пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания заказа.</param>
    /// <param name="userId">Идентификатор пользователя, создающего заказ.</param>
    /// <returns>Созданный заказ или null в случае ошибки.</returns>
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
        }

        return result;
    }

    /// <summary>
    /// Обновить существующий заказ аренды.
    /// При обновлении инвалидируются все связанные кеши (пользователя, партнера, доступных заявок).
    /// </summary>
    /// <param name="id">Идентификатор заказа.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный заказ или null, если заказ не найден.</returns>
    public async Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto)
    {
        var result = await _innerService.UpdateAsync(id, dto);

        if (result != null)
        {
            await InvalidateOrderCaches(result);
        }

        return result;
    }

    /// <summary>
    /// Завершить заказ аренды (пользователь подтверждает завершение).
    /// Инвалидирует все связанные кеши.
    /// </summary>
    /// <param name="id">Идентификатор заказа.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
    public async Task<bool> CompleteOrderAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.CompleteOrderAsync(id);

        if (success && order != null)
        {
            await InvalidateOrderCaches(order);
        }

        return success;
    }

    /// <summary>
    /// Отменить заказ аренды.
    /// Инвалидирует все связанные кеши и доступные заявки для партнеров.
    /// </summary>
    /// <param name="id">Идентификатор заказа.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
    public async Task<bool> CancelOrderAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.CancelOrderAsync(id);

        if (success && order != null)
        {
            await InvalidateOrderCaches(order);
            
            // Дополнительно инвалидируем доступные заявки (заявка больше не доступна)
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
        }

        return success;
    }
    public async Task<bool> DiscontinuedOrderAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.DiscontinuedOrderAsync(id);

        if (success && order != null)
        {
            await InvalidateOrderCaches(order);

            // Дополнительно инвалидируем доступные заявки (заявка больше не доступна)
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());

            _logger.LogInformation("Cache invalidated after cancelling order {OrderId}", id);
        }

        return success;
    }

    /// <summary>
    /// Удалить заказ аренды.
    /// Инвалидирует все связанные кеши и доступные заявки для партнеров.
    /// </summary>
    /// <param name="id">Идентификатор заказа.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _innerService.GetByIdAsync(id);
        var success = await _innerService.DeleteAsync(id);

        if (success && order != null)
        {
            await InvalidateOrderCaches(order);
            
            // Инвалидируем доступные заявки
            await _cache.RemoveByPrefixAsync(CacheKeys.AllAvailableOrdersPrefix());
        }

        return success;
    }

    #endregion

    #region Private Helpers

    /// <summary>
    /// Инвалидировать все кеши, связанные с заказом.
    /// Удаляет:
    /// - Кеш конкретного заказа
    /// - Все кеши пользователя (по статусам, активные заказы)
    /// - Кеши партнера (если назначен)
    /// - Доступные заявки (для активных заказов)
    /// </summary>
    /// <param name="order">Заказ, для которого нужно инвалидировать кеши.</param>
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
