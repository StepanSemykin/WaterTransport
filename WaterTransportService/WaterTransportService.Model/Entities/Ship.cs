namespace WaterTransportService.WaterTransportService.Model.Entities;
public class Ship
{
    public int ShipId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; }
    public int Year { get; set; }
    public string Engine { get; set; }
    public double Speed { get; set; }
    public double Length { get; set; }
    public double Width { get; set; }

    public Guid OwnerId { get; set; }
    public User Owner { get; set; }

    public ICollection<ShipPhoto> Photos { get; set; }
    public ICollection<CalendarEntry> Calendar { get; set; }
}