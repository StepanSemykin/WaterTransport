namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Статус календаря.
/// </summary>
[Table("calendar_statuses")]
public class CalendarStatus
{
    /// <summary>
    /// Идентификатор статуса календаря.
    /// </summary>
    [Key]
    [Column("id")]
    public required ushort Id { get; set; }

    /// <summary>
    /// Название статуса.
    /// </summary>
    [Required]
    [Column("name")]
    public required string Name { get; set; } // 1 - запланирован, 2 - в пути, 3 - завершен, 4 - отменен
}
