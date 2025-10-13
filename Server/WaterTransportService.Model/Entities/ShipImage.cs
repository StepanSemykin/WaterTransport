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
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL).
    /// </summary>
    [Required]
    [MaxLength(1000)]
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
    [Column("uploaded_at", TypeName = "timestamp")]
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
