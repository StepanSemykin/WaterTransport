using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record PortDto(
    //Guid Id,
    string Title,
    ushort PortTypeId,
    double Latitude,
    double Longitude,
    string Address
);

public class CreatePortDto
{
    [Required, MaxLength(256)]
    public required string Title { get; set; }

    [Required]
    public required ushort PortTypeId { get; set; }

    [Required, Range(-90, 90)]
    public required double Latitude { get; set; }

    [Required, Range(-180, 180)]
    public required double Longitude { get; set; }

    [Required, MaxLength(256)]
    public required string Address { get; set; }
}

public class UpdatePortDto
{
    [MaxLength(256)]
    public string? Title { get; set; }

    public ushort? PortTypeId { get; set; }

    [Range(-90, 90)]
    public double? Latitude { get; set; }

    [Range(-180, 180)]
    public double? Longitude { get; set; }

    [MaxLength(256)]
    public string? Address { get; set; }
}
