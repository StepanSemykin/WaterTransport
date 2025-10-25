using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record PortTypeDto(
    ushort Id,
    string Title
);

public class CreatePortTypeDto
{
    [Required]
    public required ushort Id { get; set; }

    [Required, MaxLength(32)]
    public required string Title { get; set; }
}

public class UpdatePortTypeDto
{
    [MaxLength(32)]
    public string? Title { get; set; }
}
