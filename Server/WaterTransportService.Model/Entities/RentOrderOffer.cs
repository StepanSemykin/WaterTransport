using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Отклик партнера на заказ аренды.
/// </summary>
[Table("rent_order_offers")]
public class RentOrderOffer
{
    /// <summary>
    /// Идентификатор отклика.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор заказа аренды.
    /// </summary>
    [Column("rent_order_id", TypeName = "uuid")]
    [Required]
    public required Guid RentOrderId { get; set; }

    /// <summary>
    /// Навигационное свойство на заказ аренды.
    /// </summary>
    public required RentOrder RentOrder { get; set; }

    /// <summary>
    /// Идентификатор партнера, откликнувшегося на заявку.
    /// </summary>
    [Column("partner_id", TypeName = "uuid")]
    [Required]
    public required Guid PartnerId { get; set; }

    /// <summary>
    /// Навигационное свойство на партнера.
    /// </summary>
    public required User Partner { get; set; }

    /// <summary>
    /// Идентификатор предлагаемого судна.
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    [Required]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на предлагаемое судно.
    /// </summary>
    public required Ship Ship { get; set; }

    /// <summary>
    /// Предложенная цена в рублях.
    /// </summary>
    [Column("offered_price")]
    [Required]
    public required uint OfferedPrice { get; set; }

    /// <summary>
    /// Статус отклика.
    /// </summary>
    [Required]
    [MaxLength(20)]
    [Column("status")]
    public required string Status { get; set; }

    /// <summary>
    /// Время создания отклика в UTC.
    /// </summary>
    [Column("created_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время ответа пользователя на отклик в UTC.
    /// </summary>
    [Column("responded_at", TypeName = "timestamptz")]
    public DateTime? RespondedAt { get; set; }
}
