using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// ������ ��� ������ � ��������� ��������� �� ������ ������.
/// </summary>
public class RentOrderOfferService(
    RentOrderOfferRepository offerRepository,
    RentOrderRepository rentOrderRepository,
    ShipRepository shipRepository,
    IUserRepository<Guid> userRepository,
    WaterTransportDbContext context) : IRentOrderOfferService
{
    private readonly RentOrderOfferRepository _offerRepository = offerRepository;
    private readonly RentOrderRepository _rentOrderRepository = rentOrderRepository;
    private readonly ShipRepository _shipRepository = shipRepository;
    private readonly IUserRepository<Guid> _userRepository = userRepository;
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// �������� ��� ������� ��� ����������� ������.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByRentOrderIdAsync(Guid rentOrderId)
    {
        var offers = await _offerRepository.GetByRentOrderIdAsync(rentOrderId);
        return offers.Select(MapToDto);
    }

    /// <summary>
    /// �������� ��� ������� ����������� ��������.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByPartnerIdAsync(Guid partnerId)
    {
        var offers = await _offerRepository.GetByPartnerIdAsync(partnerId);
        return offers.Select(MapToDto);
    }

    /// <summary>
    /// �������� ������ �� ��������������.
    /// </summary>
    public async Task<RentOrderOfferDto?> GetOfferByIdAsync(Guid id)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        return offer is null ? null : MapToDto(offer);
    }

    /// <summary>
    /// ������� ����� ������ �������� �� �����.
    /// </summary>
    public async Task<RentOrderOfferDto?> CreateOfferAsync(CreateRentOrderOfferDto createDto, Guid partnerId)
    {
        // ��������� ������������� ������ � ���������
        var rentOrder = await _rentOrderRepository.GetByIdWithOffersAsync(createDto.RentOrderId);
        if (rentOrder is null) return null;

        // ���������, ��� ����� � ������� �������� ��������
        if (rentOrder.Status != RentOrderStatus.AwaitingPartnerResponse
            && rentOrder.Status != RentOrderStatus.HasOffers)
            return null;

        // ��������� ������������� ��������
        var partner = await _userRepository.GetByIdAsync(partnerId);
        if (partner is null) return null;

        // ��������� ������������� ����� � ��� ��� ����������� ��������
        var ship = await _shipRepository.GetByIdWithDetailsAsync(createDto.ShipId);
        if (ship is null || ship.UserId != partnerId) return null;

        // ��������� ������������ ����������� ������
        if (!ValidateShipForOrder(ship, rentOrder))
            return null;

        // ������� ������
        var offer = new RentOrderOffer
        {
            Id = Guid.NewGuid(),
            RentOrderId = createDto.RentOrderId,
            RentOrder = rentOrder,
            PartnerId = partnerId,
            Partner = partner,
            ShipId = createDto.ShipId,
            Ship = ship,
            OfferedPrice = createDto.OfferedPrice,
            Status = RentOrderOfferStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _offerRepository.CreateAsync(offer);

        // ���� ��� ������ ������, ������ ������ ������ �� HasOffers
        if (rentOrder.Status == RentOrderStatus.AwaitingPartnerResponse)
        {
            rentOrder.Status = RentOrderStatus.HasOffers;
            await _context.SaveChangesAsync();
        }

        return MapToDto(created);
    }

    /// <summary>
    /// ������� ������ �������� (������������ �������� ��������).
    /// </summary>
    public async Task<bool> AcceptOfferAsync(Guid rentOrderId, Guid offerId)
    {
        // �������� ����� �� ����� ���������
        var rentOrder = await _rentOrderRepository.GetByIdWithOffersAsync(rentOrderId);

        if (rentOrder is null || rentOrder.Status != RentOrderStatus.HasOffers)
            return false;

        // �������� ����������� ������
        var acceptedOffer = rentOrder.Offers.FirstOrDefault(o => o.Id == offerId);
        if (acceptedOffer is null || acceptedOffer.Status != RentOrderOfferStatus.Pending)
            return false;

        // ��������� �����
        rentOrder.PartnerId = acceptedOffer.PartnerId;
        rentOrder.ShipId = acceptedOffer.ShipId;
        rentOrder.TotalPrice = acceptedOffer.OfferedPrice;
        rentOrder.Status = RentOrderStatus.Agreed;
        rentOrder.OrderDate = DateTime.UtcNow;

        // ��������� �������� ������
        acceptedOffer.Status = RentOrderOfferStatus.Accepted;
        acceptedOffer.RespondedAt = DateTime.UtcNow;

        // ��������� ��� ��������� �������
        foreach (var offer in rentOrder.Offers.Where(o => o.Id != offerId))
        {
            offer.Status = RentOrderOfferStatus.Rejected;
            offer.RespondedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// ������� ������.
    /// </summary>
    public async Task<bool> DeleteOfferAsync(Guid id)
    {
        return await _offerRepository.DeleteAsync(id);
    }

    /// <summary>
    /// ��������� ������������ ����� ����������� ������.
    /// </summary>
    private static bool ValidateShipForOrder(Ship ship, RentOrder rentOrder)
    {
        // �������� ���� �����
        if (ship.ShipType.Id != rentOrder.ShipTypeId)
            return false;

        // �������� ����� �����������
        if (ship.PortId != rentOrder.DeparturePortId)
            return false;

        // �������� �����������
        if (ship.Capacity < rentOrder.NumberOfPassengers)
            return false;

        return true;
    }

    /// <summary>
    /// �������������� �������� ������� � DTO.
    /// </summary>
    private static RentOrderOfferDto MapToDto(RentOrderOffer offer) => new(
        offer.Id,
        offer.RentOrderId,
        offer.PartnerId,
        offer.Partner.UserProfile?.Nickname ?? offer.Partner.Phone,
        offer.ShipId,
        offer.Ship.Name,
        offer.Ship.ShipType.Name,
        offer.OfferedPrice,
        offer.Status,
        offer.CreatedAt,
        offer.RespondedAt
    );
}
