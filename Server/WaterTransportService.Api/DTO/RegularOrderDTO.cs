using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record RegularOrderDto(
    Guid Id,
    Guid UserId,
    uint TotalPrice,
    ushort NumberOfPassengers,
    Guid RegularCalendarId,
    DateTime OrderDate,
    string StatusName,
    DateTime CreatedAt,
    DateTime? CancelledAt
);

public class CreateRegularOrderDto
{
    [Required]
    public required Guid UserId { get; set; }

    [Required]
    public required uint TotalPrice { get; set; }

    [Required]
    public required ushort NumberOfPassengers { get; set; }

    [Required]
    public required Guid RegularCalendarId { get; set; }

    [Required]
    public required DateTime OrderDate { get; set; }

    [Required, MaxLength(20)]
    public required string StatusName { get; set; }
}

public class UpdateRegularOrderDto
{
    public uint? TotalPrice { get; set; }
    public ushort? NumberOfPassengers { get; set; }
    public Guid? RegularCalendarId { get; set; }
    public DateTime? OrderDate { get; set; }
    [MaxLength(20)]
    public string? StatusName { get; set; }
    public DateTime? CancelledAt { get; set; }
}
