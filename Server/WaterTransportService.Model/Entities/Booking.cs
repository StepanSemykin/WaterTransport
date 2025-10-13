using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Бронирование рейса/мест пользователем.
/// </summary>
[Table("bookings")]
public class Booking
{
    /// <summary>
    /// Идентификатор бронирования.
    /// </summary>
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// GUID пользователя, оформившего бронирование.
    /// </summary>
    [Column("user_uuid", TypeName = "uuid")]
    [Required]
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public required User User { get; set; }

    /// <summary>
    /// Общая стоимость бронирования в минимальных единицах (например, копейки).
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
    /// Идентификатор записи календаря (рейса).
    /// </summary>
    [Column("calendar_id")]
    [Required]
    public required uint CalendarId { get; set; }

    /// <summary>
    /// Навигационное свойство на запись календаря.
    /// </summary>
    public required Calendar Calendar { get; set; }

    /// <summary>
    /// Дата заказа/бронирования в UTC.
    /// </summary>
    [Column("order_date")]
    [Required]
    public required DateTime OrderDate { get; set; }

    /// <summary>
    /// Статус бронирования (например: "created", "cancelled").
    /// </summary>
    [Column("status")]
    [Required]
    [MaxLength(64)]
    public required string Status { get; set; }

    /// <summary>
    /// Время создания записи бронирования в UTC.
    /// </summary>
    [Column("created_at")]
    [Required]
    public required DateTime CreatedAt { get; set; }

    /// <summary>
    /// Время отмены бронирования в UTC (если отменено).
    /// </summary>
    public DateTime? CancelledAt { get; set; }
}
