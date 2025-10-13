using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Идентификатор порта отправления.
    /// </summary>
    [Column("from_port_id", TypeName = "uuid")]
    [Required]
    public required Guid FromPortId { get; set; }

    /// <summary>
    /// Идентификатор порта назначения (опционально для аренды).
    /// </summary>
    [Column("to_port_id", TypeName = "uuid")]
    public Guid? ToPortId { get; set; }

    /// <summary>
    /// Стоимость маршрута (в минимальных единицах, напр. копейки).
    /// </summary>
    [Required]
    public required double Cost { get; set; }

    /// <summary>
    /// Идентификатор судна, используемого на маршруте.
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    [Required]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Продолжительность маршрута (в минутах) — опционально.
    /// </summary>
    public TimeSpan? DurationMinutes { get; set; }

    /// <summary>
    /// Идентификатор типа маршрута.
    /// </summary>
    [Column("type_id")]
    [Required]
    public required ushort TypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на тип маршрута.
    /// </summary>
    [ForeignKey(nameof(TypeId))]
    [InverseProperty(nameof(RouteType.Routes))]
    public required virtual RouteType Type { get; set; }
}
