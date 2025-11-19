using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Заказ аренды.
/// </summary>
[Table("rent_orders")]
public class RentOrder
{
    /// <summary>
    /// Идентификатор бронирования.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор пользователя, сделавшего бронирование.
    /// </summary>
    [Required]
    [Column("user_id", TypeName = "uuid")]
    public required Guid UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public required User User { get; set; }

    /// <summary>
    /// Идентификатор партнёра, если партнёр откликнулся на заявку.
    /// </summary>
    [Column("partner_id", TypeName = "uuid")]
    public Guid? PartnerId { get; set; }

    /// <summary>
    /// Навигационное свойство на партнёра.
    /// </summary>
    public User? Partner { get; set; }

    /// <summary>
    /// Идентификатор корабля, предложенного партнером в заказе.
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    public Guid? ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на корабль.
    /// </summary>
    public Ship? Ship { get; set; }

    /// <summary>
    /// Идентификатор желаемого типа судна.
    /// </summary>
    [Column("ship_type_id")]
    [Required]
    public required ushort ShipTypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на желаемый тип судна.
    /// </summary>
    public required ShipType ShipType { get; set; }

    /// <summary>
    /// Идентификатор порта отправления.
    /// </summary>
    [Column("departure_port_id", TypeName = "uuid")]
    [Required]
    public required Guid DeparturePortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт отправления.
    /// </summary>
    public required Port DeparturePort { get; set; }

    /// <summary>
    /// Идентификатор порта прибытия (опционально).
    /// </summary>
    [Column("arrival_port_id", TypeName = "uuid")]
    public Guid? ArrivalPortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт прибытия.
    /// </summary>
    public Port? ArrivalPort { get; set; }

    /// <summary>
    /// Общая стоимость бронирования в рублях.
    /// </summary>
    [Column("total_price")]
    public uint? TotalPrice { get; set; }

    /// <summary>
    /// Количество пассажиров в бронировании.
    /// </summary>
    [Column("number_of_passengers")]
    [Required]
    public required ushort NumberOfPassengers { get; set; }

    /// <summary>
    /// Время отправления (UTC).
    /// </summary>
    [Column("rental_start_time", TypeName = "timestamptz")]
    [Required]
    public required DateTime RentalStartTime { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    [Column("rental_end_time", TypeName = "timestamptz")]
    public DateTime? RentalEndTime { get; set; }

    /// <summary>
    /// Дата оплаты в UTC.
    /// </summary>
    [Column("order_date", TypeName = "timestamptz")]
    public DateTime? OrderDate { get; set; }

    /// <summary>
    /// Название статуса бронирования.
    /// </summary>
    [Required]
    [MaxLength(20)]
    [Column("status")]
    public required string Status { get; set; }

    /// <summary>
    /// Время создания записи бронирования в UTC.
    /// </summary>
    [Column("created_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Отклики партнеров на данный заказ.
    /// </summary>
    public ICollection<RentOrderOffer> Offers { get; set; } = [];

    /// <summary>
    /// Время отмены бронирования в UTC (если отменено).
    /// </summary>
    [Column("cancelled_at", TypeName = "timestamptz")]
    public DateTime? CancelledAt { get; set; }
}