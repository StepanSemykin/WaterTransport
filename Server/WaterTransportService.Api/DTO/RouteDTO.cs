using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RouteDto(
    Guid Id,
    Guid FromPortId,
    Guid? ToPortId,
    double Cost,
    Guid ShipId,
    TimeSpan? DurationMinutes
);

public class CreateRouteDto
{
    [Required]
    public required Guid FromPortId { get; set; }

    public Guid? ToPortId { get; set; }

    [Required]
    public required double Cost { get; set; }

    [Required]
    public required Guid ShipId { get; set; }

    public TimeSpan? DurationMinutes { get; set; }
}

public class UpdateRouteDto
{
    public Guid? FromPortId { get; set; }

    public Guid? ToPortId { get; set; }

    public double? Cost { get; set; }

    public Guid? ShipId { get; set; }

    public TimeSpan? DurationMinutes { get; set; }
}
