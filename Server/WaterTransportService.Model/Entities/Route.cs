using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Маршрут.
/// </summary>
[Table("routes")]
public class Route
{
    /// <summary>
    /// Идентификатор маршрута.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор порта отправления.
    /// </summary>
    [Column("from_port_id", TypeName ="uuid")]
    [Required]
    public required Guid FromPortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт отправления.
    /// </summary>
    public required Port FromPort { get; set; }

    /// <summary>
    /// Идентификатор порта назначения (опционально для аренды).
    /// </summary>
    [Column("to_port_id", TypeName ="uuid")]
    public Guid? ToPortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт назначения.
    /// </summary>
    public Port? ToPort { get; set; }

    /// <summary>
    /// Стоимость маршрута.
    /// </summary>
    [Required]
    [Column("cost", TypeName = "numeric(10,2)")]
    public required double Cost { get; set; }

    /// <summary>
    /// Идентификатор судна, используемого на маршруте.
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    [Required]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>
    public required Ship Ship { get; set; }

    /// <summary>
    /// Продолжительность маршрута (в минутах) — опционально.
    /// </summary>
    [Column("duration_minutes", TypeName = "interval")]
    public TimeSpan? DurationMinutes { get; set; }

    /// <summary>
    /// Идентификатор типа маршрута.
    /// </summary>
    [Column("route_type_id")]
    [Required]
    public required ushort RouteTypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на тип маршрута.
    /// </summary>
    public required RouteType RouteType { get; set; }
}
