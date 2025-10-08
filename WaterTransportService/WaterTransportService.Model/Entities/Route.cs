namespace WaterTransportService.Model.Entities;

/// <summary>
/// Маршрут.
/// </summary>
public class Route
{
    /// <summary>
    /// Идентификатор маршрута.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор порта отправления.
    /// </summary>
    public required Guid FromPortId { get; set; }

    /// <summary>
    /// Идентификатор порта назначения (опционально для аренды).
    /// </summary>
    public Guid? ToPortId { get; set; }

    /// <summary>
    /// Стоимость маршрута (в минимальных единицах, напр. копейки).
    /// </summary>
    public required double Cost { get; set; }

    /// <summary>
    /// Идентификатор судна, используемого на маршруте.
    /// </summary>
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Продолжительность маршрута (в минутах) — опционально.
    /// </summary>
    public TimeSpan? DurationMinutes { get; set; }

    /// <summary>
    /// Идентификатор типа маршрута.
    /// </summary>
    public required ushort TypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на тип маршрута.
    /// </summary>
    public required virtual RouteType Type { get; set; }
}
