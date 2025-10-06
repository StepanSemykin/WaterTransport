namespace WaterTransportService.Model.Entities;

public class ShipImage
{
    public required uint Id { get; set; }
    public required uint ShipId { get; set; }
    public required Ship Ship { get; set; }
    public required string ImagePath { get; set; }
}
