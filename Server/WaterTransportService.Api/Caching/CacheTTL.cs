namespace WaterTransportService.Api.Caching;

/// <summary>
/// Время жизни (TTL) для различных типов кешируемых данных.
/// </summary>
public static class CacheTTL
{
    /// <summary>
    /// Доступные заявки - часто меняются.
    /// </summary>
    public static TimeSpan AvailableOrders => TimeSpan.FromSeconds(10);

    /// <summary>
    /// Активная заявка пользователя - критичная актуальность.
    /// </summary>
    public static TimeSpan ActiveOrder => TimeSpan.FromSeconds(5);

    /// <summary>
    /// Заявки по статусу "Agreed" - меняются реже.
    /// </summary>
    public static TimeSpan AgreedOrders => TimeSpan.FromSeconds(30);

    /// <summary>
    /// Завершенные заявки - почти не меняются.
    /// </summary>
    public static TimeSpan CompletedOrders => TimeSpan.FromMinutes(5);

    /// <summary>
    /// Отклики на заявку - средняя частота изменений.
    /// </summary>
    public static TimeSpan OrderOffers => TimeSpan.FromSeconds(15);

    /// <summary>
    /// Отклики партнера - меняются реже.
    /// </summary>
    public static TimeSpan PartnerOffers => TimeSpan.FromSeconds(30);

    /// <summary>
    /// Конкретная заявка по ID - средняя частота.
    /// </summary>
    public static TimeSpan OrderById => TimeSpan.FromSeconds(20);

    /// <summary>
    /// Все заявки с пагинацией - редко используется.
    /// </summary>
    public static TimeSpan AllOrders => TimeSpan.FromMinutes(2);

    /// <summary>
    /// Получить TTL в зависимости от статуса заявки.
    /// </summary>
    public static TimeSpan GetTTLByStatus(string status)
    {
        return status?.ToLower() switch
        {
            "completed" => CompletedOrders,
            "agreed" => AgreedOrders,
            _ => AvailableOrders
        };
    }
}
