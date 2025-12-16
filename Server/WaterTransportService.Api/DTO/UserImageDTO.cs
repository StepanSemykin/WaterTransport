using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record UserImageDto(
    Guid Id,
    Guid UserId,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

/// <summary>
/// DTO дл€ создани€ изображени€ пользовател€.
/// </summary>
public class CreateUserImageDto
{
    /// <summary>
    /// »дентификатор пользовател€.
    /// </summary>
    [Required]
    public required Guid UserId { get; set; }

    /// <summary>
    /// ‘айл изображени€.
    /// </summary>
    [Required]
    public required IFormFile Image { get; set; }

    /// <summary>
    /// явл€етс€ ли изображение основным.
    /// </summary>
    public bool IsPrimary { get; set; }
}

public class UpdateUserImageDto
{
    public IFormFile? Image { get; set; }

    public bool? IsPrimary { get; set; }
}
