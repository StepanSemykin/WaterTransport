namespace WaterTransportService.WaterTransportService.Model.Entities;

public class Review
{
    public int ReviewId { get; set; }
    public Guid AuthorId { get; set; }
    public User Author { get; set; }

    public int? ShipId { get; set; }
    public Ship Ship { get; set; }

    public Guid? PartnerId { get; set; }
    public User Partner { get; set; }

    public int Rating { get; set; }   // от 1 до 5
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
