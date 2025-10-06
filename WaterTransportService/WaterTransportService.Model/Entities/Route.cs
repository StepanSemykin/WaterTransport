namespace WaterTransportService.Model.Entities;

public class Route
{
    public required uint Id { get; set; }
    public required uint FromPortId { get; set; }
    public uint? ToPortId { get; set; }
    public required double Cost { get; set; }
    public required uint ShipId { get; set; }
    public TimeSpan? DurationMinutes { get; set; }
    public required ushort TypeId { get; set; }
    public required RouteType Type { get; set; }
}
