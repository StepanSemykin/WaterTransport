namespace WaterTransportService.WaterTransportService.Model.Entities;

public class PortPhoto
{
    public int PortPhotoId { get; set; }
    public string Url { get; set; }
    public string? Description { get; set; }

    public int PortId { get; set; }
    public Port Port { get; set; }
}