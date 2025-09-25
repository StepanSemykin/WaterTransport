namespace WaterTransportService.WaterTransportService.Model.Entities;

public class User
{
    public Guid UserId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string PasswordHash { get; set; }
    public DateTime RegisteredAt { get; set; }
    public double Rating { get; set; }
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }

    public ICollection<Ship> Ships { get; set; }
    public ICollection<Booking> Bookings { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<UserPhoto> Photos { get; set; }
}
