using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Запись регулярных рейсов в календаре.
/// </summary>
[Table("regular_calendars")]
public class RegularCalendar
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
    [Column("departure_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime DepartureAt { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    [Column("arrived_at", TypeName = "timestamptz")]
    public DateTime? ArrivedAt { get; set; }

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

    /// <summary>
    /// Название статуса.
    /// </summary>
    [Required]
    [Column("name")]
    [MaxLength(20)]
    public required string StatusName { get; set; } // 1 - запланирован, 2 - в пути, 3 - завершен, 4 - отменен
}
