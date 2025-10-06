namespace WaterTransportService.Model.Entities;

public class Booking
{
    public required uint Id { get; set; }
    public required Guid UserUuid { get; set; }
    public required User User { get; set; }
    public required uint TotalPrice { get; set; }
    public required ushort NumberOfPassengers { get; set; }
    public required uint CalendarId { get; set; }
    public required Calendar Calendar { get; set; }
    public required DateTime OrderDate { get; set; }
    public required string Status { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
}
