namespace WaterTransportService.Api.Caching;

/// <summary>
/// Генератор ключей для кеширования.
/// </summary>
public static class CacheKeys
{
    // ==================== Rent Orders ====================
    
    /// <summary>
    /// Доступные заявки для партнера.
    /// </summary>
    public static string AvailableOrdersForPartner(Guid partnerId) 
        => $"rent-orders:available:partner:{partnerId}";
    
    /// <summary>
    /// Заявки пользователя по статусу.
    /// </summary>
    public static string UserOrdersByStatus(Guid userId, string status) 
        => $"rent-orders:user:{userId}:status:{status}";
    
    /// <summary>
    /// Активная заявка пользователя.
    /// </summary>
    public static string ActiveOrderForUser(Guid userId) 
        => $"rent-orders:user:{userId}:active";
    
    /// <summary>
    /// Заявки партнера по статусу.
    /// </summary>
    public static string PartnerOrdersByStatus(Guid partnerId, string status) 
        => $"rent-orders:partner:{partnerId}:status:{status}";
    
    /// <summary>
    /// Конкретная заявка по ID.
    /// </summary>
    public static string OrderById(Guid orderId) 
        => $"rent-orders:id:{orderId}";
    
    /// <summary>
    /// Все заявки с пагинацией.
    /// </summary>
    public static string AllOrders(int page, int pageSize) 
        => $"rent-orders:all:page:{page}:size:{pageSize}";

    // ==================== Rent Order Offers ====================
    
    /// <summary>
    /// Отклики на заявку.
    /// </summary>
    public static string OffersByOrderId(Guid orderId) 
        => $"rent-order-offers:order:{orderId}";
    
    /// <summary>
    /// Отклики партнера.
    /// </summary>
    public static string OffersByPartnerId(Guid partnerId) 
        => $"rent-order-offers:partner:{partnerId}";
    
    /// <summary>
    /// Конкретный отклик по ID.
    /// </summary>
    public static string OfferById(Guid offerId) 
        => $"rent-order-offers:id:{offerId}";
    
    /// <summary>
    /// Отклики на заявки пользователя по статусу.
    /// </summary>
    public static string OffersForUserOrdersByStatus(Guid userId, string status) 
        => $"rent-order-offers:user:{userId}:status:{status}";

    // ==================== Prefixes for bulk invalidation ====================
    
    /// <summary>
    /// Префикс для всех доступных заявок.
    /// </summary>
    public static string AllAvailableOrdersPrefix() 
        => "rent-orders:available:";
    
    /// <summary>
    /// Префикс для всех заявок пользователя.
    /// </summary>
    public static string AllUserOrdersPrefix(Guid userId) 
        => $"rent-orders:user:{userId}:";
    
    /// <summary>
    /// Префикс для всех заявок партнера.
    /// </summary>
    public static string AllPartnerOrdersPrefix(Guid partnerId) 
        => $"rent-orders:partner:{partnerId}:";
    
    /// <summary>
    /// Префикс для всех откликов на заявку.
    /// </summary>
    public static string AllOffersForOrderPrefix(Guid orderId) 
        => $"rent-order-offers:order:{orderId}";
    
    /// <summary>
    /// Префикс для всех откликов партнера.
    /// </summary>
    public static string AllPartnerOffersPrefix(Guid partnerId) 
        => $"rent-order-offers:partner:{partnerId}";
    
    /// <summary>
    /// Префикс для всех откликов пользователя.
    /// </summary>
    public static string AllUserOffersPrefix(Guid userId) 
        => $"rent-order-offers:user:{userId}:";
}
