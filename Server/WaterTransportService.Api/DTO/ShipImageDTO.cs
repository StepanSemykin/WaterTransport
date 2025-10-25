using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record ShipImageDto(
    Guid Id,
    Guid ShipId,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

public class CreateShipImageDto
{
    [Required]
    public required Guid ShipId { get; set; }

    [Required, MaxLength(3000)]
    public required string ImagePath { get; set; }

    public bool IsPrimary { get; set; }
}

public class UpdateShipImageDto
{
    [MaxLength(3000)]
    public string? ImagePath { get; set; }

    public bool? IsPrimary { get; set; }
}
