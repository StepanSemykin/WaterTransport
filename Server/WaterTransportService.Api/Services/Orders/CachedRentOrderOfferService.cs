using WaterTransportService.Api.Caching;
using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Декоратор сервиса откликов на заказы аренды с кешированием.
/// Оборачивает базовый сервис откликов, добавляя слой кеширования для оптимизации производительности.
/// Автоматически инвалидирует устаревшие данные при изменениях откликов.
/// </summary>
public class CachedRentOrderOfferService(
    IRentOrderOfferService innerService,
    ICacheService cache) : IRentOrderOfferService
{
    private readonly IRentOrderOfferService _innerService = innerService;
    private readonly ICacheService _cache = cache;

    #region Read Methods (с кешированием)

    /// <summary>
    /// Получить все отклики для конкретного заказа аренды.
    /// Результат кешируется на время, определенное в CacheTTL.OrderOffers.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <returns>Коллекция откликов на заказ.</returns>
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

    /// <summary>
    /// Получить все отклики для заказов пользователя со статусом "Pending".
    /// Используется для получения ожидающих рассмотрения откликов на заказы пользователя.
    /// Результат кешируется на время, определенное в CacheTTL.OrderOffers.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Коллекция ожидающих откликов.</returns>
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

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// Результат кешируется на время, определенное в CacheTTL.PartnerOffers.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Коллекция всех откликов партнера.</returns>
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

    /// <summary>
    /// Получить отклик по идентификатору.
    /// Результат кешируется на время, определенное в CacheTTL.OrderOffers.
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>Отклик или null, если не найден.</returns>
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

    /// <summary>
    /// Получить заказы партнера по статусу отклика.
    /// Возвращает заказы, на которые партнер откликнулся с указанным статусом.
    /// Результат кешируется на время, определенное в CacheTTL.PartnerOffers.
    /// </summary>
    /// <param name="status">Статус отклика (например, "Pending", "Accepted", "Rejected").</param>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Список заказов с откликами в указанном статусе.</returns>
    public async Task<IEnumerable<RentOrderDto>> GetPartnerOrdersByStatusAsync(string status, Guid partnerId)
    {
        var cacheKey = CacheKeys.PartnerOrdersByStatus(partnerId, status);

        var cached = await _cache.GetAsync<List<RentOrderDto>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }

        var result = (await _innerService.GetPartnerOrdersByStatusAsync(status, partnerId)).ToList();

        if (result.Count > 0)
        {
            await _cache.SetAsync(cacheKey, result, CacheTTL.PartnerOffers);
        }

        return result;
    }

    #endregion

    #region Write Methods (с инвалидацией кеша)

    /// <summary>
    /// Создать новый отклик партнера на заказ аренды.
    /// При создании инвалидируются:
    /// - Все кеши откликов (по заказу, партнеру, пользователю)
    /// - Доступные заявки для партнера
    /// - Кеш заказа (статус может измениться на "HasOffers")
    /// - Заказы партнера по статусу
    /// </summary>
    /// <param name="createDto">Данные для создания отклика.</param>
    /// <param name="partnerId">Идентификатор партнера, создающего отклик.</param>
    /// <returns>Созданный отклик или null в случае ошибки.</returns>
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

            // Инвалидируем заказы партнера по статусу
            await _cache.RemoveByPrefixAsync(CacheKeys.AllPartnerOrdersPrefix(partnerId));

            // Нужно инвалидировать кеши заказа - запрашиваем его чтобы получить userId
            // (т.к. в DTO отклика нет вложенного RentOrder)
        }

        return result;
    }

    /// <summary>
    /// Принять отклик партнера (пользователь выбирает партнера).
    /// При принятии инвалидируются:
    /// - Все кеши откликов (все отклики на заказ становятся неактуальными)
    /// - Кеш заказа (статус изменяется на "Agreed")
    /// - Доступные заявки (заказ больше не доступен)
    /// - Заказы партнера по статусу
    /// - Отклики на заказы пользователя
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <param name="offerId">Идентификатор принимаемого отклика.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
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
        }

        return success;
    }

    /// <summary>
    /// Отклонить отклик партнера.
    /// При отклонении инвалидируются:
    /// - Все кеши откликов (по заказу, партнеру, пользователю)
    /// - Заказы партнера по статусу
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
    public async Task<bool> RejectOfferAsync(Guid id)
    {
        var offer = await _innerService.GetOfferByIdAsync(id);
        var success = await _innerService.RejectOfferAsync(id);

        if (success && offer != null)
        {
            await InvalidateOfferCaches(offer);

            // Инвалидируем заказы партнера по статусу
            await _cache.RemoveByPrefixAsync(CacheKeys.AllPartnerOrdersPrefix(offer.PartnerId));
        }

        return success;
    }

    /// <summary>
    /// Удалить отклик.
    /// При удалении инвалидируются:
    /// - Все кеши откликов (по заказу, партнеру, пользователю)
    /// - Кеш заказа (количество откликов изменилось)
    /// - Заказы партнера по статусу
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
    public async Task<bool> DeleteOfferAsync(Guid id)
    {
        var offer = await _innerService.GetOfferByIdAsync(id);
        var success = await _innerService.DeleteOfferAsync(id);

        if (success && offer != null)
        {
            await InvalidateOfferCaches(offer);

            // Инвалидируем кеши заявки (количество откликов изменилось)
            await _cache.RemoveAsync(CacheKeys.OrderById(offer.RentOrderId));

            // Инвалидируем заказы партнера по статусу
            await _cache.RemoveByPrefixAsync(CacheKeys.AllPartnerOrdersPrefix(offer.PartnerId));
        }

        return success;
    }

    #endregion

    #region Private Helpers

    /// <summary>
    /// Инвалидировать все кеши, связанные с откликом.
    /// Удаляет:
    /// - Кеш конкретного отклика по ID
    /// - Все отклики на заказ (GetOffersByRentOrderIdAsync)
    /// - Все отклики партнера (GetOffersByPartnerIdAsync)
    /// - Отклики на заказы пользователя (GetOffersByUser)
    /// </summary>
    /// <param name="offer">Отклик, для которого нужно инвалидировать кеши.</param>
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
