namespace WaterTransportService.WaterTransportService.Model.Entities;

public class ShipPhoto
{
    public int ShipPhotoId { get; set; }
    public string Url { get; set; }
    public string? Description { get; set; }

    public int ShipId { get; set; }
    public Ship Ship { get; set; }
}
