using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RentCalendarDto(
    Guid Id,
    Guid ShipId,
    DateTime LowerTimeLimit,
    DateTime? HighTimeLimit
);

public class CreateRentCalendarDto
{
    [Required]
    public required Guid ShipId { get; set; }

    [Required]
    public required DateTime LowerTimeLimit { get; set; }

    public DateTime? HighTimeLimit { get; set; }
}

public class UpdateRentCalendarDto
{
    public Guid? ShipId { get; set; }

    public DateTime? LowerTimeLimit { get; set; }

    public DateTime? HighTimeLimit { get; set; }
}
