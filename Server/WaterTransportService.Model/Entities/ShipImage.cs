using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Изображение судна с метаданными.
/// </summary>
[Table("ship_images")]
public class ShipImage : BaseEntity
{
    /// <summary>
    /// Идентификатор изображения судна.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор судна.
    /// </summary>
    [Required]
    [Column("ship_id", TypeName = "uuid")]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>
    public required Ship Ship { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL).
    /// </summary>
    [Required]
    [MaxLength(3000)]
    [Column("image_path")]
    public required string ImagePath { get; set; }

    /// <summary>
    /// Флаг, указывающий, что это основное изображение судна.
    /// </summary>
    [Column("is_primary")]
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Время загрузки изображения в UTC.
    /// </summary>
    [Required]
    [Column("uploaded_at", TypeName = "timestamptz")]
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
