namespace WaterTransportService.Model.Entities;

/// <summary>
/// Статус календаря.
/// </summary>
public class CalendarStatus
{
    /// <summary>
    /// Идентификатор статуса календаря.
    /// </summary>
    public required ushort Id { get; set; }

    /// <summary>
    /// Название статуса.
    /// </summary>
    public required string Name { get; set; } // 1 - запланирован, 2 - в пути, 3 - завершен, 4 - отменен
}
