using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

/// <summary>
/// Расширенный DTO для заказа аренды с вложенными объектами.
/// </summary>
public record RentOrderDto(
    Guid Id,
    Guid UserId,
    UserProfileDto? UserProfile,
    ushort ShipTypeId,
    string? ShipTypeName,
    Guid DeparturePortId,
    PortDto? DeparturePort,
    Guid? ArrivalPortId,
    PortDto? ArrivalPort,
    Guid? PartnerId,
    UserProfileDto? PartnerProfile,
    Guid? ShipId,
    ShipDetailsDto? Ship,
    uint? TotalPrice,
    ushort NumberOfPassengers,
    DateTime RentalStartTime,
    DateTime? RentalEndTime,
    DateTime? OrderDate,
    string Status
//DateTime CreatedAt,
//DateTime? CancelledAt
);

/// <summary>
/// DTO для доступного заказа с подходящими суднами партнера.
/// </summary>
public record AvailableRentOrderDto(
    Guid Id,
    Guid UserId,
    UserProfileDto? UserProfile,
    ushort ShipTypeId,
    string? ShipTypeName,
    Guid DeparturePortId,
    PortDto? DeparturePort,
    Guid? ArrivalPortId,
    PortDto? ArrivalPort,
    ushort NumberOfPassengers,
    DateTime RentalStartTime,
    DateTime? RentalEndTime,
    string Status,
    DateTime CreatedAt,
    List<ShipDetailsDto> MatchingShips  // Список подходящих судов партнера
);

/// <summary>
/// DTO судна с основным изображением для заказа аренды.
/// </summary>
public record ShipDetailsDto(
    Guid Id,
    string Name,
    ushort ShipTypeId,
    string ShipTypeName,
    ushort Capacity,
    string RegistrationNumber,
    DateTime? YearOfManufacture,
    ushort? MaxSpeed,
    ushort? Width,
    ushort? Length,
    string? Description,
    uint? CostPerHour,
    Guid PortId,
    Guid UserId,
    string? PrimaryImageUrl,
    string? PrimaryImageMimeType
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
