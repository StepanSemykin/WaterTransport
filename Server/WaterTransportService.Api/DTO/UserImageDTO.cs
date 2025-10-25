using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record UserImageDto(
    Guid Id,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

public class CreateUserImageDto
{
    [Required, MaxLength(3000)]
    public required string ImagePath { get; set; }

    public bool IsPrimary { get; set; }
}

public class UpdateUserImageDto
{
    [MaxLength(3000)]
    public string? ImagePath { get; set; }

    public bool? IsPrimary { get; set; }
}
