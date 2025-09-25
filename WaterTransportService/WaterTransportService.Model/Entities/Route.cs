namespace WaterTransportService.WaterTransportService.Model.Entities;

public class Route
{
    public int RouteId { get; set; }

    public int FromPortId { get; set; }
    public Port FromPort { get; set; }

    public int ToPortId { get; set; }
    public Port ToPort { get; set; }

    public TimeSpan? Duration { get; set; }
    public decimal BasePrice { get; set; }

    public ICollection<Booking> Bookings { get; set; }
}
