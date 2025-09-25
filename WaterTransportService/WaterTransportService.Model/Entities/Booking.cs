namespace WaterTransportService.WaterTransportService.Model.Entities;
public class Booking
{
    public int BookingId { get; set; }
    public Guid UserId { get; set; }      // заказчик
    public User User { get; set; }
    public Guid PartnerId { get; set; }   // владелец судна
    public User Partner { get; set; }

    public int ShipId { get; set; }
    public Ship Ship { get; set; }

    public int StartPortId { get; set; }
    public int EndPortId { get; set; }
    public Port StartPort { get; set; }
    public Port EndPort { get; set; }

    public DateTime DateTime { get; set; }
    public int Passengers { get; set; }
    public string Status { get; set; }
    public decimal Price { get; set; }

    public Payment Payment { get; set; }
}
