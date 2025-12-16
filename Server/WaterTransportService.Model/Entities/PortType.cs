using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Тип порта.
/// </summary>
[Table("port_types")]
public class PortType
{
    /// <summary>
    /// Идентификатор типа порта.
    /// </summary>
    [Key]
    [Column("id")]
    public required ushort Id { get; set; }

    /// <summary>
    /// Название типа порта.
    /// </summary>
    [Required]
    [MaxLength(32)]
    [Column("title")]
    public required string Title { get; set; }

    /// <summary>
    /// Список портов данного типа.
    /// </summary>
    public ICollection<Port> Ports { get; set; } = [];
}
