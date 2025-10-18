using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Бронирование в регулярном рейсе.
/// </summary>
[Table("regular_orders")]
public class RegularOrder
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
    /// Общая стоимость бронирования в рублях.
    /// </summary>
    [Column("total_price")]
    [Required]
    public required uint TotalPrice { get; set; }

    /// <summary>
    /// Количество пассажиров в бронировании.
    /// </summary>
    [Column("number_of_passengers")]
    [Required]
    public required ushort NumberOfPassengers { get; set; }

    /// <summary>
    /// Идентификатор записи регулярного рейса в календаре.
    /// </summary>
    [Column("calendar_id", TypeName="uuid")]
    [Required]
    public required Guid RegularCalendarId { get; set; }

    /// <summary>
    /// Навигационное свойство на запись регулярного рейса в календаре.
    /// </summary>
    public required RegularCalendar? RegularCalendar { get; set; }

    /// <summary>
    /// Дата заказа/бронирования в UTC.
    /// </summary>
    [Column("order_date", TypeName = "timestamptz")]
    [Required]
    public required DateTime OrderDate { get; set; }

    /// <summary>
    /// Название статуса бронирования.
    /// </summary>
    [Required]
    [MaxLength(20)]
    [Column("name")]
    public required string StatusName { get; set; }

    /// <summary>
    /// Время создания записи бронирования в UTC.
    /// </summary>
    [Column("created_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время отмены бронирования в UTC (если отменено).
    /// </summary>
    [Column("cancelled_at", TypeName = "timestamptz")]
    public DateTime? CancelledAt { get; set; }
}
