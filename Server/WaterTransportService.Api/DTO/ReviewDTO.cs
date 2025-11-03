using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record ReviewDto(
    Guid Id,
    Guid AuthorId,
    Guid? UserId,
    Guid? ShipId,
    string? Comment,
    byte Rating,
    DateTime CreatedAt,
    bool IsActive
);

public class CreateReviewDto
{
    [Required]
    public required Guid AuthorId { get; set; }

    public Guid? UserId { get; set; }

    public Guid? ShipId { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    [Required, Range(0, 5)]
    public required byte Rating { get; set; }
}

public class UpdateReviewDto
{
    public Guid? UserId { get; set; }

    public Guid? ShipId { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    [Range(0, 5)]
    public byte? Rating { get; set; }

    public bool? IsActive { get; set; }
}
