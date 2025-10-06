namespace WaterTransportService.Model.Entities;

public class Review
{
    public required uint Id { get; set; }
    public required Guid AuthorUuid { get; set; }
    public required User Author { get; set; }
    public Guid? UserUuid { get; set; }
    public User? User { get; set; }
    public uint? ShipId { get; set; }
    public Ship? Ship { get; set; }
    public string? Comment { get; set; }
    public required uint Rating { get; set; } // от 0 до 5
    public required DateTime CreatedAt { get; set; }    
}
