namespace WaterTransportService.Model.Entities;

public class UserImage
{
    public required uint Id { get; set; }
    public required Guid UserUuid { get; set; }
    public required User User { get; set; }
    public required string ImagePath { get; set; }
}
