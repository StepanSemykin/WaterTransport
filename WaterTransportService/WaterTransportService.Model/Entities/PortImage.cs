namespace WaterTransportService.Model.Entities;

public class PortImage
{
    public required uint Id { get; set; }
    public required uint PortId { get; set; }
    public required Port Port { get; set; }
    public required string ImagePath { get; set; }
}
