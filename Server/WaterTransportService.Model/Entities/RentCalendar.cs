
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace WaterTransportService.Model.Entities;

public class RentCalendar
{
    /// <summary>
    /// Идентификатор записи календаря для аренды.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор судна, используемого на маршруте.
    /// </summary>
    [Column("ship_id", TypeName = "uuid")]
    [Required]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>
    public required Ship Ship { get; set; }

    /// <summary>
    /// Время отправления (UTC).
    /// </summary>
    [Column("lower_time_limit", TypeName = "timestamptz")]
    [Required]
    public required DateTime LowerTimeLimit { get; set; }

    /// <summary>
    /// Время прибытия (UTC), если известно.
    /// </summary>
    [Column("high_time_limit", TypeName = "timestamptz")]
    public DateTime? HighTimeLimit { get; set; }
}
