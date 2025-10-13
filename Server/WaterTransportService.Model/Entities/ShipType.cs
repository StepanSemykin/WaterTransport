using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Справочник типов судов.
/// </summary>
public class ShipType
{
    /// <summary>
    /// Идентификатор типа судна.
    /// </summary>
    [Key]
    public required ushort Id { get; set; }

    /// <summary>
    /// Название типа судна.
    /// </summary>
    [Required]
    [MaxLength(256)]
    public required string Name { get; set; }

    /// <summary>
    /// Описание типа судна (опционально).
    /// </summary>
    [MaxLength(1000)]
    public string? Description { get; set; }
}