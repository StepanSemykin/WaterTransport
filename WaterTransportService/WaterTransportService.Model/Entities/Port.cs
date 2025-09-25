namespace WaterTransportService.WaterTransportService.Model.Entities;

public class Port
{
    public int PortId { get; set; }
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public ICollection<Route> RoutesFrom { get; set; }
    public ICollection<Route> RoutesTo { get; set; }
    public ICollection<PortPhoto> Photos { get; set; }

}
