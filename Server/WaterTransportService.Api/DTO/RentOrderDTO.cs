using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RentOrderDto(
    Guid Id,
    Guid UserId,
    uint TotalPrice,
    ushort NumberOfPassengers,
    Guid RentCalendarId,
    DateTime RentalStartTime,
    DateTime? RentalEndTime,
    DateTime? OrderDate,
    string StatusName,
    DateTime CreatedAt,
    DateTime? CancelledAt
);

public class CreateRentOrderDto
{
    [Required]
    public required Guid UserId { get; set; }

    [Required]
    public required uint TotalPrice { get; set; }

    [Required]
    public required ushort NumberOfPassengers { get; set; }

    [Required]
    public required Guid RentCalendarId { get; set; }

    [Required]
    public required DateTime RentalStartTime { get; set; }

    public DateTime? RentalEndTime { get; set; }

    public DateTime? OrderDate { get; set; }

    [Required, MaxLength(20)]
    public required string StatusName { get; set; }
}

public class UpdateRentOrderDto
{
    public uint? TotalPrice { get; set; }
    public ushort? NumberOfPassengers { get; set; }
    public Guid? RentCalendarId { get; set; }
    public DateTime? RentalStartTime { get; set; }
    public DateTime? RentalEndTime { get; set; }
    public DateTime? OrderDate { get; set; }
    [MaxLength(20)]
    public string? StatusName { get; set; }
    public DateTime? CancelledAt { get; set; }
}
