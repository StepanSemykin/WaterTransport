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
    [Required]
    public required Guid UserProfileId { get; set; }

    [Required]
    public required IFormFile Image { get; set; }

    public bool IsPrimary { get; set; }
}

public class UpdateUserImageDto
{
    public IFormFile? Image { get; set; }

    public bool? IsPrimary { get; set; }
}
