namespace WaterTransportService.Model.Constants;

/// <summary>
/// Константы статусов заказа аренды.
/// </summary>
public static class RentOrderStatus
{
    /// <summary>
    /// Ожидание откликов партнеров.
    /// </summary>
    public const string AwaitingPartnerResponse = "AwaitingResponse";

    /// <summary>
    /// Есть отклики от партнеров.
    /// </summary>
    public const string HasOffers = "HasOffers";

    /// <summary>
    /// Пользователь выбрал партнера.
    /// </summary>
    public const string Agreed = "Agreed";

    /// <summary>
    /// Аренда завершена.
    /// </summary>
    public const string Completed = "Completed";

    /// <summary>
    /// Заказ отменен.
    /// </summary>
    public const string Cancelled = "Cancelled";
}
