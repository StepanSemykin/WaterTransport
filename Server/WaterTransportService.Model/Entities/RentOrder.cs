
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

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
    /// Идентификатор записи календаря (рейса), на который сделано бронирование.
    /// </summary>
    [Column("rent_calendar_id", TypeName = "uuid")]
    [Required]
    public required Guid RentCalendarId { get; set; }

    /// <summary>
    /// Навигационное свойство на запись календаря (рейс).
    /// </summary>
    public required RentCalendar RentCalendar { get; set; }

    /// <summary>
    /// Время отправления (UTC).
    /// </summary>
    [Column("rental_start_time", TypeName = "timestamp")]
    [Required]
    public required DateTime RentalStartTime { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    [Column("rental_end_time", TypeName = "timestamp")]
    public DateTime? RentalEndTime { get; set; }

    /// <summary>
    /// Дата оплаты в UTC.
    /// </summary>
    [Column("order_date", TypeName = "timestamp")]
    public DateTime? OrderDate { get; set; }

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
    [Column("created_at", TypeName = "timestamp")]
    [Required]
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время отмены бронирования в UTC (если отменено).
    /// </summary>
    [Column("cancelled_at", TypeName = "timestamp")]
    public DateTime? CancelledAt { get; set; }

}