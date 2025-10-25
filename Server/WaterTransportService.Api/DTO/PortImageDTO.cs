using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record PortImageDto(
    Guid Id,
    Guid PortId,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

public class CreatePortImageDto
{
    [Required]
    public required Guid PortId { get; set; }

    [Required, MaxLength(3000)]
    public required string ImagePath { get; set; }

    public bool IsPrimary { get; set; }
}

public class UpdatePortImageDto
{
    [MaxLength(3000)]
    public string? ImagePath { get; set; }

    public bool? IsPrimary { get; set; }
}
