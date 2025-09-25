namespace WaterTransportService.WaterTransportService.Model.Entities;

public class Payment
{
    public int PaymentId { get; set; }
    public int BookingId { get; set; }
    public Booking Booking { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public string Method { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
