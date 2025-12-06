namespace WaterTransportService.Model.Constants;

/// <summary>
/// Константы статусов отклика партнера на заказ аренды.
/// </summary>
public static class RentOrderOfferStatus
{
    /// <summary>
    /// Отклик ожидает рассмотрения пользователем.
    /// </summary>
    public const string Pending = "Pending";

    /// <summary>
    /// Отклик принят пользователем.
    /// </summary>
    public const string Accepted = "Accepted";

    /// <summary>
    /// Отклик отклонен.
    /// </summary>
    public const string Rejected = "Rejected";
}
