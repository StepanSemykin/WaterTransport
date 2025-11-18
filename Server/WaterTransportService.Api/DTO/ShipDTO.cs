using System.ComponentModel.DataAnnotations;
using WaterTransportService.Authentication.DTO;

namespace WaterTransportService.Api.DTO;

//public record ShipDto(
//    //Guid Id,
//    string Name,
//    ushort ShipTypeId,
//    ushort Capacity,
//    string RegistrationNumber,
//    DateTime? YearOfManufacture,
//    ushort? MaxSpeed,
//    ushort? Width,
//    ushort? Length,
//    string? Description,
//    uint? CostPerHour,
//    PortDto PortDto,
//    UserDto UserDto
//    //string PortTitle,    
//    //string UserPhone
//    //Guid PortId,
//    //Guid UserId
//);

public record ShipDto
{
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
    public PortDto Port { get; init; } = default!;
    public UserDto User { get; init; } = default!;
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
    public required PortDto PortDto { get; set; }

    [Required]
    public required UserDto UserDto { get; set; }
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

    public required PortDto PortDto { get; set; }

    public required UserDto UserDto { get; set; }
}
