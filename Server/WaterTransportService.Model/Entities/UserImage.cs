using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Изображение пользователя и сопутствующие метаданные.
/// </summary>
[Table("user_images")]
public class UserImage : BaseEntity
{
    /// <summary>
    /// Идентификатор изображения.
    /// </summary>
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL в хранилище).
    /// </summary>
    [Required]
    [MaxLength(3000)]
    [Column("image_path")]
    public required string ImagePath { get; set; }

    /// <summary>
    /// Флаг, указывающий, что это основное (профильное) изображение пользователя.
    /// </summary>
    [Column("is_primary")]
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Время загрузки изображения в UTC.
    /// </summary>
    [Required]
    [Column("uploaded_at", TypeName="timestamp")]
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
