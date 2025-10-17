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
    [Column("id", TypeName ="uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор автора отзыва.
    /// </summary>
    [Column("author_id", TypeName = "uuid")]
    [Required]
    public required Guid AuthorId { get; set; }

    /// <summary>
    /// Навигационное свойство на автора.
    /// </summary>
    [ForeignKey(nameof(AuthorId))]
    [InverseProperty(nameof(User.Reviews))]
    public required User Author { get; set; }

    /// <summary>
    /// Идентификатор пользователя, к которому относится отзыв (если отзыв о пользователе).
    /// </summary>
    [Column("user_id", TypeName ="uuid")]
    public Guid? UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя, к которому относится отзыв.
    /// </summary>
    [ForeignKey(nameof(UserId))]
    [InverseProperty(nameof(User.ReceivedReviews))]
    public User? User { get; set; }

    /// <summary>
    /// Идентификатор судна, к которому относится отзыв (если отзыв о судне).
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    public Guid? ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно, к которому относится отзыв.
    /// </summary>
    [ForeignKey(nameof(ShipId))]
    [InverseProperty(nameof(Ship.Reviews))]
    public Ship? Ship { get; set; }

    /// <summary>
    /// Текст отзыва.
    /// </summary>
    [Column("comment")]
    [MaxLength(1000)]
    public string? Comment { get; set; }

    /// <summary>
    /// Рейтинг от 0 до 5.
    /// </summary>
    [Column("rating")]
    [Required]
    [Range(0, 5)]
    public required uint Rating { get; set; }

    /// <summary>
    /// Время создания отзыва в UTC.
    /// </summary>
    [Column("created_at", TypeName="timestamp")]
    [Required]
    public new required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
