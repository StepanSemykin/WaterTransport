namespace WaterTransportService.Model.Entities;

public class Port
{
    public required uint Id { get; set; }
    public required string Title{ get; set; }
    public required ushort TypeId { get; set; }
    public required double Latitude { get; set; }  // от -90 до 90
    public required double Longitude { get; set; } // от -180 до 180
    public required string Address { get; set; }
    public required ICollection<Ship> Ships { get; set; }
}
