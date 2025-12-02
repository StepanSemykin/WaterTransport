using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RentOrderDto(
    Guid Id,
    Guid UserId,
    ushort ShipTypeId,
    Guid DeparturePortId,
    Guid? ArrivalPortId,
    Guid? PartnerId,
    Guid? ShipId,
    uint? TotalPrice,
    ushort NumberOfPassengers,
    DateTime RentalStartTime,
    DateTime? RentalEndTime,
    DateTime? OrderDate,
    string Status
    //DateTime CreatedAt,
    //DateTime? CancelledAt
);

public class CreateRentOrderDto
{
    [Required]
    public required ushort ShipTypeId { get; set; }

    [Required]
    public required Guid DeparturePortId { get; set; }

    public Guid? ArrivalPortId { get; set; } = null;

    [Required]
    public required ushort NumberOfPassengers { get; set; }

    [Required]
    public required DateTime RentalStartTime { get; set; }

    public DateTime? RentalEndTime { get; set; }

    public TimeSpan? Duration { get; set; }

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
    //public DateTime? CancelledAt { get; set; }
}
