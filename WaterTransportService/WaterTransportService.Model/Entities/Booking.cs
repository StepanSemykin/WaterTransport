namespace WaterTransportService.Model.Entities;

/// <summary>
/// Бронирование рейса/мест пользователем.
/// </summary>
public class Booking
{
    /// <summary>
    /// Идентификатор бронирования.
    /// </summary>
    public required uint Id { get; set; }

    /// <summary>
    /// GUID пользователя, оформившего бронирование.
    /// </summary>
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public required virtual User User { get; set; }

    /// <summary>
    /// Общая стоимость бронирования в минимальных единицах (например, копейки).
    /// </summary>
    public required uint TotalPrice { get; set; }

    /// <summary>
    /// Количество пассажиров в бронировании.
    /// </summary>
    public required ushort NumberOfPassengers { get; set; }

    /// <summary>
    /// Идентификатор записи календаря (рейса).
    /// </summary>
    public required uint CalendarId { get; set; }

    /// <summary>
    /// Навигационное свойство на запись календаря.
    /// </summary>
    public required virtual Calendar Calendar { get; set; }

    /// <summary>
    /// Дата заказа/бронирования в UTC.
    /// </summary>
    public required DateTime OrderDate { get; set; }

    /// <summary>
    /// Статус бронирования (например: "created", "cancelled").
    /// </summary>
    public required string Status { get; set; }

    /// <summary>
    /// Время создания записи бронирования в UTC.
    /// </summary>
    public required DateTime CreatedAt { get; set; }

    /// <summary>
    /// Время отмены бронирования в UTC (если отменено).
    /// </summary>
    public DateTime? CancelledAt { get; set; }
}
