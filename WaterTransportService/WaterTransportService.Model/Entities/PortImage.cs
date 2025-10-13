using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Изображение порта с метаданными.
/// </summary>
[Table("port_images")]
public class PortImage : BaseEntity
{
    /// <summary>
    /// Идентификатор изображения порта.
    /// </summary>
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL).
    /// </summary>
    [Required]
    [MaxLength(1000)]
    public required string ImagePath { get; set; }

    /// <summary>
    /// Флаг, указывающий, что это основное изображение порта.
    /// </summary>
    [Required]
    [Column("is_primary")]
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Время загрузки изображения в UTC.
    /// </summary>
    [Required]
    [Column("uploaded_at", TypeName = "timestamp")]
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
