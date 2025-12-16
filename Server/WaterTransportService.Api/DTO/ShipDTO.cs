using System.ComponentModel.DataAnnotations;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Api.DTO;

public record ShipDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public ushort ShipTypeId { get; init; }
    public ushort Capacity { get; init; }
    public string RegistrationNumber { get; init; } = default!;
    public DateTime? YearOfManufacture { get; init; }
    public ushort? MaxSpeed { get; init; }
    public ushort? Width { get; init; }
    public ushort? Length { get; init; }
    public string? Description { get; init; }
    public uint? CostPerHour { get; init; }
    public Guid PortId { get; init; }
    public Guid UserId { get; init; }
    public Review[] Reviews { get; init; } = [];
}

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
