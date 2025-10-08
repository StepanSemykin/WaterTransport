namespace WaterTransportService.Model.Entities;

/// <summary>
/// Тип маршрута (например, аренда или фиксированный маршрут).
/// </summary>
public class RouteType
{
    /// <summary>
    /// Идентификатор типа маршрута.
    /// </summary>
    public required ushort Id { get; set; }

    /// <summary>
    /// Название типа маршрута.
    /// </summary>
    public required string Name { get; set; } // 1 - аренда, 2 - фиксированный маршрут
}
