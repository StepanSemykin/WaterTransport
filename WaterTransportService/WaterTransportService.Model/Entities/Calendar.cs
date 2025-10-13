using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Запись календаря (конкретный рейс/отправление судна по маршруту).
/// </summary>
[Table("calendars")]
public class Calendar
{
    /// <summary>
    /// Идентификатор записи календаря.
    /// </summary>
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Идентификатор маршрута.
    /// </summary>
    [Column("route_id")]
    [Required]
    public required uint RouteId { get; set; }

    /// <summary>
    /// Навигационное свойство на маршрут.
    /// </summary>
    public required Route Route { get; set; }

    /// <summary>
    /// Время отправления (UTC).
    /// </summary>
    [Required]
    public required DateTime DepartureAt { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    public DateTime? ArrivedAt { get; set; }

    /// <summary>
    /// Идентификатор статуса календаря.
    /// </summary>
    [Column("status_id")]
    [Required]
    public required ushort StatusId { get; set; } 

    /// <summary>
    /// Навигационное свойство на статус календаря.
    /// </summary>
    [ForeignKey(nameof(StatusId))]
    [InverseProperty(nameof(CalendarStatus.Calendars))]
    public required CalendarStatus Status { get; set; }

    /// <summary>
    /// GUID владельца записи (внешний ключ на User.Uuid).
    /// </summary>
    [Column("owner_uuid", TypeName = "uuid")]
    [Required]
    public required Guid OwnerUuid { get; set; }

    [ForeignKey(nameof(OwnerUuid))]
    [InverseProperty(nameof(User.Calendars))]
    public required User Owner { get; set; }
}
