using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record ShipTypeDto(
    ushort Id,
    string Name,
    string? Description
);

public class CreateShipTypeDto
{
    [Required]
    public required ushort Id { get; set; }

    [Required, MaxLength(32)]
    public required string Name { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }
}

public class UpdateShipTypeDto
{
    [MaxLength(32)]
    public string? Name { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }
}
