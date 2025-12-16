using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Запись календаря занятости судна.
/// </summary>
[Table("ship_rental_calendar")]
public class ShipRentalCalendar : BaseEntity
{
    /// <summary>
    /// Идентификатор записи календаря.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Судно, для которого зафиксирована занятость.
    /// </summary>
    [Required]
    [Column("ship_id", TypeName = "uuid")]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Заказ аренды, породивший запись.
    /// </summary>
    [Required]
    [Column("rent_order_id", TypeName = "uuid")]
    public required Guid RentOrderId { get; set; }

    /// <summary>
    /// Порт отправления, если заказ маршрутный.
    /// </summary>
    [Column("departure_port_id", TypeName = "uuid")]
    public Guid? DeparturePortId { get; set; }

    /// <summary>
    /// Порт прибытия, если заказ маршрутный.
    /// </summary>
    [Column("arrival_port_id", TypeName = "uuid")]
    public Guid? ArrivalPortId { get; set; }

    /// <summary>
    /// Время начала аренды.
    /// </summary>
    [Required]
    [Column("start_time", TypeName = "timestamptz")]
    public required DateTime StartTime { get; set; }

    /// <summary>
    /// Время окончания аренды (если известно).
    /// </summary>
    [Column("end_time", TypeName = "timestamptz")]
    public DateTime? EndTime { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>
    public Ship? Ship { get; set; }

    /// <summary>
    /// Навигационное свойство на заказ аренды.
    /// </summary>
    public RentOrder? RentOrder { get; set; }
}
