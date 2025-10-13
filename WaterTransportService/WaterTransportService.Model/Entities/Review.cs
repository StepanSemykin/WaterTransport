using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Отзыв пользователя о пользователе/судне.
/// </summary>
[Table("reviews")]
public class Review : BaseEntity
{
    /// <summary>
    /// Идентификатор отзыва.
    /// </summary>
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// GUID автора отзыва.
    /// </summary>
    [Column("author_uuid", TypeName = "uuid")]
    [Required]
    public required Guid AuthorUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на автора.
    /// </summary>
    public required User Author { get; set; }

    /// <summary>
    /// GUID пользователя, к которому относится отзыв (если отзыв о пользователе).
    /// </summary>

    public Guid? UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя, к которому относится отзыв.
    /// </summary>

    public User? User { get; set; }

    /// <summary>
    /// Идентификатор судна, к которому относится отзыв (если отзыв о судне).
    /// </summary>

    public Guid? ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>

    public Ship? Ship { get; set; }

    /// <summary>
    /// Текст отзыва.
    /// </summary>
    [MaxLength(2000)]
    public string? Comment { get; set; }

    /// <summary>
    /// Рейтинг от 0 до 5.
    /// </summary>
    [Column("rating")]
    [Required]
    [Range(0, 5)]
    public required uint Rating { get; set; } // от 0 до 5

    /// <summary>
    /// Время создания отзыва в UTC.
    /// </summary>
    [Column("created_at", TypeName="timestamp")]
    [Required]
    public new required DateTime CreatedAt { get; set; }    
}
