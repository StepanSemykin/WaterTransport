using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RegularCalendarDto(
    Guid Id,
    Guid RouteId,
    DateTime DepartureAt,
    DateTime? ArrivedAt,
    Guid UserId,
    string StatusName
);

public class CreateRegularCalendarDto
{
    [Required]
    public required Guid RouteId { get; set; }

    [Required]
    public required DateTime DepartureAt { get; set; }

    public DateTime? ArrivedAt { get; set; }

    [Required]
    public required Guid UserId { get; set; }

    [Required, MaxLength(20)]
    public required string StatusName { get; set; }
}

public class UpdateRegularCalendarDto
{
    public Guid? RouteId { get; set; }

    public DateTime? DepartureAt { get; set; }

    public DateTime? ArrivedAt { get; set; }

    public Guid? UserId { get; set; }

    [MaxLength(20)]
    public string? StatusName { get; set; }
}
