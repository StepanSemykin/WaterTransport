namespace WaterTransportService.Model.Entities;

public class User
{
    public Guid Uuid { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? Patronymic { get; set; }
    public required ushort RoleId { get; set; }
    public required string Phone { get; set; }
    public string? Email { get; set; }
    public required string Nickname { get; set; }
    public DateTime? Birthday { get; set; }
    public required DateTime RegisteredAt { get; set; }
    public string? Description { get; set; }

    public required ICollection<UserImage> Images { get; set; }
    public required ICollection<Password> Passwords { get; set; } //???
    public required ICollection<Booking> Bookings { get; set; }
    public required ICollection<Review> Reviews { get; set; }
    public ICollection<Ship>? Ships { get; set; }
}
