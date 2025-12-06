using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

/// <summary>
/// Расширенный DTO отклика с полной информацией о партнере и судне.
/// </summary>
public record RentOrderOfferDto(
    Guid Id,
    Guid RentOrderId,
    Guid PartnerId,
    UserProfileDto? PartnerProfile,
    Guid ShipId,
    ShipDetailsDto? Ship,
    uint OfferedPrice,
    string Status,
    DateTime CreatedAt,
    DateTime? RespondedAt
);

public class CreateRentOrderOfferDto
{
    [Required]
    public required Guid RentOrderId { get; set; }

    [Required]
    public required Guid ShipId { get; set; }

    [Required]
    public required uint OfferedPrice { get; set; }
}

public class UpdateRentOrderOfferDto
{
    public uint? OfferedPrice { get; set; }

    [MaxLength(20)]
    public string? Status { get; set; }
}

public class AcceptRentOrderOfferDto
{
    [Required]
    public required Guid OfferId { get; set; }
}
