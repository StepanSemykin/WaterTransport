using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record ShipDto(
    Guid Id,
    string Name,
    ushort ShipTypeId,
    ushort Capacity,
    string RegistrationNumber,
    DateTime? YearOfManufacture,
    ushort? MaxSpeed,
    ushort? Width,
    ushort? Length,
    string? Description,
    uint? CostPerHour,
    Guid PortId,
    Guid UserId
);

public class CreateShipDto
{
    [Required, MaxLength(256)]
    public required string Name { get; set; }

    [Required]
    public required ushort ShipTypeId { get; set; }

    [Required]
    public required ushort Capacity { get; set; }

    [Required, MaxLength(11)]
    public required string RegistrationNumber { get; set; }

    public DateTime? YearOfManufacture { get; set; }

    public ushort? MaxSpeed { get; set; }

    public ushort? Width { get; set; }

    public ushort? Length { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public uint? CostPerHour { get; set; }

    [Required]
    public required Guid PortId { get; set; }

    [Required]
    public required Guid UserId { get; set; }
}

public class UpdateShipDto
{
    [MaxLength(256)]
    public string? Name { get; set; }

    public ushort? ShipTypeId { get; set; }

    public ushort? Capacity { get; set; }

    [MaxLength(11)]
    public string? RegistrationNumber { get; set; }

    public DateTime? YearOfManufacture { get; set; }

    public ushort? MaxSpeed { get; set; }

    public ushort? Width { get; set; }

    public ushort? Length { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public uint? CostPerHour { get; set; }

    public Guid? PortId { get; set; }

    public Guid? UserId { get; set; }
}
