using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RentOrderDto(
    Guid Id,
    Guid UserId,
    uint? TotalPrice,
    ushort NumberOfPassengers,
    DateTime RentalStartTime,
    DateTime? RentalEndTime,
    DateTime? OrderDate,
    string Status,
    DateTime CreatedAt,
    DateTime? CancelledAt
);

public class CreateRentOrderDto
{
    [Required]
    public required Guid UserId { get; set; }

    public uint? TotalPrice { get; set; }

    [Required]
    public required ushort NumberOfPassengers { get; set; }

    [Required]
    public required DateTime RentalStartTime { get; set; }

    public DateTime? RentalEndTime { get; set; }

    public DateTime? OrderDate { get; set; }

    [Required, MaxLength(20)]
    public required string Status { get; set; }
}

public class UpdateRentOrderDto
{
    public Guid? PartnerId { get; set; }
    public Guid? ShipId { get; set; }
    public uint? TotalPrice { get; set; }
    public ushort? NumberOfPassengers { get; set; }
    public DateTime? RentalStartTime { get; set; }
    public DateTime? RentalEndTime { get; set; }
    public DateTime? OrderDate { get; set; }
    [MaxLength(20)]
    public string? Status { get; set; }
    public DateTime? CancelledAt { get; set; }
}
