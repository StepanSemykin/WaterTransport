using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Отзыв пользователя о пользователе/судне/порте.
/// </summary>
[Table("reviews")]
public class Review : BaseEntity
{
    /// <summary>
    /// Идентификатор отзыва.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
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
    [Column("user_id", TypeName = "uuid")]
    public Guid? UserId { get; set; }


    /// <summary>
    /// Идентификатор судна, к которому относится отзыв (если отзыв о судне).
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    public Guid? ShipId { get; set; }


    /// <summary>
    /// Идентификатор порта, к которому относится отзыв (если отзыв о порте).
    /// </summary>
    [Column("port_id", TypeName = "uuid")]
    public Guid? PortId { get; set; }


    /// <summary>
    /// Идентификатор заказа аренды, на основании которого оставлен отзыв.
    /// Обязателен для отзывов на партнеров и суда.
    /// </summary>
    [Column("rent_order_id", TypeName = "uuid")]
    public Guid? RentOrderId { get; set; }

    /// <summary>
    /// Навигационное свойство на заказ аренды.
    /// </summary>
    [ForeignKey(nameof(RentOrderId))]
    public RentOrder? RentOrder { get; set; }

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
    public required byte Rating { get; set; }

    /// <summary>
    /// Время создания отзыва в UTC.
    /// </summary>
    [Column("created_at", TypeName = "timestamptz")]
    [Required]
    public new required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время последнего обновления отзыва в UTC.
    /// </summary>
    [Column("updated_at", TypeName = "timestamptz")]
    public new DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Флаг активности записи. Если false — запись считается удалённой/неактивной.
    /// </summary>
    [Column("is_active")]
    public bool IsActive { get; set; } = true;
}
