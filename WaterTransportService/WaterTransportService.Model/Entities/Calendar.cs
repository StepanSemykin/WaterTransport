namespace WaterTransportService.Model.Entities;

/// <summary>
/// Запись календаря.
/// </summary>
public class Calendar
{
    /// <summary>
    /// Идентификатор записи календаря.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор маршрута.
    /// </summary>
    public required Guid RouteId { get; set; }

    /// <summary>
    /// Навигационное свойство на маршрут.
    /// </summary>
    public required virtual Route Route { get; set; }

    /// <summary>
    /// Время отправления (UTC).
    /// </summary>
    public required DateTime DepartureAt { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    public DateTime? ArrivedAt { get; set; }

    /// <summary>
    /// Идентификатор статуса календаря.
    /// </summary>
    public required ushort StatusId { get; set; } 

    /// <summary>
    /// Навигационное свойство на статус календаря.
    /// </summary>
    public required virtual CalendarStatus Status { get; set; }

    /// <summary>
    /// GUID владельца записи (внешний ключ на User.Uuid).
    /// </summary>
    public required Guid OwnerUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на владельца записи.
    /// </summary>
    public required virtual User Owner { get; set; }
}
