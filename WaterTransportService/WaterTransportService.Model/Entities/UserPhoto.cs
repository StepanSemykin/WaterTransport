namespace WaterTransportService.WaterTransportService.Model.Entities;

public class UserPhoto
{
    public int UserPhotoId { get; set; }
    public string Url { get; set; }
    public string? Description { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }
}