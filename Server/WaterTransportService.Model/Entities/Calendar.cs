using System.ComponentModel.DataAnnotations;

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
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор маршрута.
    /// </summary>
    [Column("route_id", TypeName = "uuid")]
    public Guid RouteId { get; set; }

    /// <summary>
    /// Навигационное свойство на маршрут.
    /// </summary>
    public Route? Route { get; set; }

    /// <summary>
    /// Время отправления (UTC).
    /// </summary>
    [Column("departure_at", TypeName = "timestamp")]
    [Required]
    public required DateTime DepartureAt { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    [Column("arrived_at", TypeName = "timestamp")]
    public DateTime? ArrivedAt { get; set; }

    /// <summary>
    /// Идентификатор статуса записи календаря (внешний ключ на справочник статусов).
    /// </summary>
    [Column("status_id")]
    [Required]
    public required ushort CalendarStatusId { get; set; }

    /// <summary>
    /// Навигационное свойство на статус записи календаря.
    /// </summary>
    public required CalendarStatus CalendarStatus { get; set; }

    /// <summary>
    /// Владелец записи.
    /// </summary>
    [Column("user_id", TypeName = "uuid")]
    [Required] 
    public required Guid UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на владельца записи.
    /// </summary>
    public required User User { get; set; }
}
