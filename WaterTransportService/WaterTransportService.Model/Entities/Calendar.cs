namespace WaterTransportService.Model.Entities;

public class Calendar
{
    public required uint Id { get; set; }
    public required uint RouteId { get; set; }
    public required Route Route { get; set; }
    public required DateTime DepartureAt { get; set; }
    public DateTime? ArrivedAt { get; set; }
    public required ushort StatusId { get; set; } 
    public required CalendarStatus Status { get; set; }
    public required uint OwnerUuid { get; set; }
    public required User Owner { get; set; }
}
