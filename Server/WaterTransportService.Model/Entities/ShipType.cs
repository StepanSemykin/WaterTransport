using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Справочник типов судов.
/// </summary>
[Table("ship_types")]
public class ShipType
{
    /// <summary>
    /// Идентификатор типа судна.
    /// </summary>
    [Key]
    [Column("id")]
    public required ushort Id { get; set; }

    /// <summary>
    /// Название типа судна.
    /// </summary>
    [Required]
    [MaxLength(32)]
    [Column("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Описание типа судна (опционально).
    /// </summary>
    [MaxLength(1000)]
    [Column("description")]
    public string? Description { get; set; }

    /// <summary>
    /// Список судов данного типа.
    /// </summary>
    public ICollection<Ship> Ships { get; set; } = [];
}