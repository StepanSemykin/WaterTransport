using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

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
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор порта.
    /// </summary>
    public required Guid PortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт.
    /// </summary>
    public required Port Port { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL).
    /// </summary>
    [Required]
    [MaxLength(3000)]
    [Column("image_path")]
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
