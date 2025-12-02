using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Сервис для работы с откликами партнеров на заказы аренды.
/// </summary>
public class RentOrderOfferService(
    RentOrderOfferRepository offerRepository,
    RentOrderRepository rentOrderRepository,
    ShipRepository shipRepository,
    IUserRepository<Guid> userRepository,
    WaterTransportDbContext context,
    IMapper mapper) : IRentOrderOfferService
{
    private readonly RentOrderOfferRepository _offerRepository = offerRepository;
    private readonly RentOrderRepository _rentOrderRepository = rentOrderRepository;
    private readonly ShipRepository _shipRepository = shipRepository;
    private readonly IUserRepository<Guid> _userRepository = userRepository;
    private readonly WaterTransportDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить все отклики для конкретного пользователя.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByUser(Guid UserId)
    {
        // Получаем отклики с полными данными через репозиторий
        var offers = await _offerRepository.GetOffersForUserOrdersWithDetailsAsync(
            UserId, 
            RentOrderOfferStatus.Pending);

        return _mapper.Map<List<RentOrderOfferDto>>(offers);
    }

    /// <summary>
    /// Получить все отклики для конкретного заказа.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByRentOrderIdAsync(Guid rentOrderId)
    {
        var offers = await _offerRepository.GetByRentOrderIdWithDetailsAsync(rentOrderId);
        return _mapper.Map<List<RentOrderOfferDto>>(offers);
    }

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByPartnerIdAsync(Guid partnerId)
    {
        var offers = await _offerRepository.GetByPartnerIdWithDetailsAsync(partnerId);
        return _mapper.Map<List<RentOrderOfferDto>>(offers);
    }

    /// <summary>
    /// Получить отклик по идентификатору.
    /// </summary>
    public async Task<RentOrderOfferDto?> GetOfferByIdAsync(Guid id)
    {
        var offer = await _offerRepository.GetByIdWithDetailsAsync(id);
        return offer is null ? null : _mapper.Map<RentOrderOfferDto>(offer);
    }

    /// <summary>
    /// Создать новый отклик партнера на заказ.
    /// </summary>
    public async Task<RentOrderOfferDto?> CreateOfferAsync(CreateRentOrderOfferDto createDto, Guid partnerId)
    {
        // Проверяем существование заказа с откликами
        var rentOrder = await _rentOrderRepository.GetByIdWithOffersAsync(createDto.RentOrderId);
        if (rentOrder is null) return null;

        // Проверяем, что заказ в статусе ожидания откликов
        if (rentOrder.Status != RentOrderStatus.AwaitingPartnerResponse 
            && rentOrder.Status != RentOrderStatus.HasOffers)
            return null;

        // Проверяем существование партнера
        var partner = await _userRepository.GetByIdAsync(partnerId);
        if (partner is null) return null;

        // Проверяем существование судна и что оно принадлежит партнеру
        var ship = await _shipRepository.GetByIdWithDetailsAsync(createDto.ShipId);
        if (ship is null || ship.UserId != partnerId) return null;

        // Проверяем соответствие требованиям заказа
        if (!ValidateShipForOrder(ship, rentOrder))
            return null;

        // Создаем отклик
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

        // Если это первый отклик, меняем статус заказа на HasOffers
        if (rentOrder.Status == RentOrderStatus.AwaitingPartnerResponse)
        {
            rentOrder.Status = RentOrderStatus.HasOffers;
            await _context.SaveChangesAsync();
        }

        // Перезагружаем с навигационными свойствами
        return await GetOfferByIdAsync(created.Id);
    }

    /// <summary>
    /// Принять отклик партнера (пользователь выбирает партнера).
    /// </summary>
    public async Task<bool> AcceptOfferAsync(Guid rentOrderId, Guid offerId)
    {
        // Получаем заказ со всеми откликами
        var rentOrder = await _rentOrderRepository.GetByIdWithOffersAsync(rentOrderId);

        if (rentOrder is null || rentOrder.Status != RentOrderStatus.HasOffers)
            return false;

        // Получаем принимаемый отклик
        var acceptedOffer = rentOrder.Offers.FirstOrDefault(o => o.Id == offerId);
        if (acceptedOffer is null || acceptedOffer.Status != RentOrderOfferStatus.Pending)
            return false;

        // Обновляем заказ
        rentOrder.PartnerId = acceptedOffer.PartnerId;
        rentOrder.ShipId = acceptedOffer.ShipId;
        rentOrder.TotalPrice = acceptedOffer.OfferedPrice;
        rentOrder.Status = RentOrderStatus.Agreed;
        rentOrder.OrderDate = DateTime.UtcNow;

        // Обновляем принятый отклик
        acceptedOffer.Status = RentOrderOfferStatus.Accepted;
        acceptedOffer.RespondedAt = DateTime.UtcNow;

        // Отклоняем все остальные отклики
        foreach (var offer in rentOrder.Offers.Where(o => o.Id != offerId))
        {
            offer.Status = RentOrderOfferStatus.Rejected;
            offer.RespondedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить отклик.
    /// </summary>
    public async Task<bool> DeleteOfferAsync(Guid id)
    {
        return await _offerRepository.DeleteAsync(id);
    }

    /// <summary>
    /// Проверить соответствие судна требованиям заказа.
    /// </summary>
    private static bool ValidateShipForOrder(Ship ship, RentOrder rentOrder)
    {
        // Проверка типа судна
        if (ship.ShipType.Id != rentOrder.ShipTypeId)
            return false;

        // Проверка порта отправления
        if (ship.PortId != rentOrder.DeparturePortId)
            return false;

        // Проверка вместимости
        if (ship.Capacity < rentOrder.NumberOfPassengers)
            return false;

        return true;
    }

    /// <summary>
    /// Отклонить отклик партнера.
    /// </summary>
    public async Task<bool> RejectOfferAsync(Guid offerId)
    {
        // Получаем отклик
        var offer = await _offerRepository.GetByIdAsync(offerId);
        if (offer is null || offer.Status != RentOrderOfferStatus.Pending)
            return false;

        // Отклоняем выбранный отклик
        offer.Status = RentOrderOfferStatus.Rejected;
        offer.RespondedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
