using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Статус бронирования.
/// </summary>
[Table("booking_statuses")]
public class BookingStatus
{
    /// <summary>
    /// Идентификатор статуса бронирования.
    /// </summary>
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Название статуса бронирования.
    /// </summary>
    [Required]
    [MaxLength(20)]
    [Column("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Список бронирований, имеющих данный статус.
    /// </summary>
    public ICollection<Booking> Bookings { get; set; } = [];
}
