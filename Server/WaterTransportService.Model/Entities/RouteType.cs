using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Тип маршрута (например, аренда или фиксированный маршрут).
/// </summary>
[Table("route_types")]
public class RouteType
{
    /// <summary>
    /// Идентификатор типа маршрута.
    /// </summary>
    [Key]
    [Column("id")]
    public required ushort Id { get; set; }

    /// <summary>
    /// Название типа маршрута.
    /// </summary>
    [Required]
    [MaxLength(32)]
    [Column("name")]
    public required string Name { get; set; } // 1 - аренда, 2 - фиксированный маршрут

    /// <summary>
    /// Список маршрутов данного типа.
    /// </summary>
    public ICollection<Route> Routes { get; set; } = [];
}
