using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Extensions;
using WaterTransportService.Infrastructure.FileStorage;
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
    ShipRentalCalendarRepository shipRentalCalendarRepository,
    WaterTransportDbContext context,
    IFileStorageService fileStorageService,
    IMapper mapper) : IRentOrderOfferService
{
    private readonly RentOrderOfferRepository _offerRepository = offerRepository;
    private readonly RentOrderRepository _rentOrderRepository = rentOrderRepository;
    private readonly ShipRepository _shipRepository = shipRepository;
    private readonly IUserRepository<Guid> _userRepository = userRepository;
    private readonly ShipRentalCalendarRepository _shipRentalCalendarRepository = shipRentalCalendarRepository;
    private readonly WaterTransportDbContext _context = context;
    private readonly IFileStorageService _fileStorageService = fileStorageService;
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

        var dtos = _mapper.Map<List<RentOrderOfferDto>>(offers);

        // Обогащаем изображениями в Base64
        for (int i = 0; i < dtos.Count; i++)
        {
            if (dtos[i].Ship != null)
            {
                var shipWithImage = await dtos[i].Ship!.WithBase64ImageAsync(_fileStorageService);
                dtos[i] = dtos[i] with { Ship = shipWithImage };
            }
        }

        return dtos;
    }

    /// <summary>
    /// Получить все отклики для конкретного заказа.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByRentOrderIdAsync(Guid rentOrderId)
    {
        var offers = await _offerRepository.GetByRentOrderIdWithDetailsAsync(rentOrderId);
        var dtos = _mapper.Map<List<RentOrderOfferDto>>(offers);

        // Обогащаем изображениями в Base64
        for (int i = 0; i < dtos.Count; i++)
        {
            if (dtos[i].Ship != null)
            {
                var shipWithImage = await dtos[i].Ship!.WithBase64ImageAsync(_fileStorageService);
                dtos[i] = dtos[i] with { Ship = shipWithImage };
            }
        }

        return dtos;
    }

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// </summary>
    public async Task<IEnumerable<RentOrderOfferDto>> GetOffersByPartnerIdAsync(Guid partnerId)
    {
        var offers = await _offerRepository.GetByPartnerIdWithDetailsAsync(partnerId);
        var dtos = _mapper.Map<List<RentOrderOfferDto>>(offers);

        // Обогащаем изображениями в Base64
        for (int i = 0; i < dtos.Count; i++)
        {
            if (dtos[i].Ship != null)
            {
                var shipWithImage = await dtos[i].Ship!.WithBase64ImageAsync(_fileStorageService);
                dtos[i] = dtos[i] with { Ship = shipWithImage };
            }
        }

        return dtos;
    }

    /// <summary>
    /// Получить заказы партнера по конкретному статусу отклика.
    /// </summary>
    /// <param name="status">Статус отклика.</param>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Список заказов, связанных с партнером.</returns>
    public async Task<IEnumerable<RentOrderDto>> GetPartnerOrdersByStatusAsync(string status, Guid partnerId)
    {
        //var offers = await _offerRepository.GetByPartnerIdWithDetailsAsync(partnerId);

        var offers = await _offerRepository.GetByStatusWithDetailsAsync(status, partnerId);
        //if (offers == null)
        //{
        //    return null;
        //}

        var newOrders = new List<RentOrder>();
        var offersList = offers.ToList();
        for (int i = 0; i < offersList.Count; i++)
        {
            var orderId = offersList[i].RentOrderId;
            var order = await _rentOrderRepository.GetByIdWithDetailsAsync(orderId);
            var newOrder = order;

            newOrder.PartnerId = offersList[i].PartnerId;
            newOrder.ShipId = offersList[i].ShipId;
            //Console.WriteLine("Ship: " + offersList[i].Ship);
            newOrder.Ship = offersList[i].Ship;
            newOrder.TotalPrice = offersList[i].OfferedPrice;
            newOrder.OrderDate = DateTime.UtcNow;

            newOrders.Add(newOrder);
        }

        var dtos = _mapper.Map<List<RentOrderDto>>(newOrders);

        // Обогащаем изображениями в Base64
        for (int i = 0; i < dtos.Count; i++)
        {
            if (dtos[i].Ship != null)
            {
                var shipWithImage = await dtos[i].Ship!.WithBase64ImageAsync(_fileStorageService);
                dtos[i] = dtos[i] with { Ship = shipWithImage };
            }
        }

        return dtos;
    }

    /// <summary>
    /// Получить отклик по идентификатору.
    /// </summary>
    public async Task<RentOrderOfferDto?> GetOfferByIdAsync(Guid id)
    {
        var offer = await _offerRepository.GetByIdWithDetailsAsync(id);
        if (offer is null) return null;

        var dto = _mapper.Map<RentOrderOfferDto>(offer);

        // Обогащаем Ship изображением в Base64, если оно есть
        if (dto.Ship != null)
        {
            var shipWithImage = await dto.Ship.WithBase64ImageAsync(_fileStorageService);
            dto = dto with { Ship = shipWithImage };
        }

        return dto;
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

        var shipBusy = await _shipRentalCalendarRepository.HasOverlapAsync(
            ship.Id,
            rentOrder.RentalStartTime,
            rentOrder.RentalEndTime);
        if (shipBusy)
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

        var existingEntry = await _shipRentalCalendarRepository.GetByRentOrderIdAsync(rentOrderId);
        var shipBusy = await _shipRentalCalendarRepository.HasOverlapAsync(
            acceptedOffer.ShipId,
            rentOrder.RentalStartTime,
            rentOrder.RentalEndTime,
            existingEntry?.Id);
        if (shipBusy)
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
        await EnsureCalendarEntryAsync(rentOrder);
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

    private async Task EnsureCalendarEntryAsync(RentOrder rentOrder)
    {
        if (!rentOrder.ShipId.HasValue)
        {
            return;
        }

        var entry = await _shipRentalCalendarRepository.GetByRentOrderIdAsync(rentOrder.Id);
        if (entry is null)
        {
            entry = new ShipRentalCalendar
            {
                Id = Guid.NewGuid(),
                ShipId = rentOrder.ShipId.Value,
                RentOrderId = rentOrder.Id,
                DeparturePortId = rentOrder.DeparturePortId,
                ArrivalPortId = rentOrder.ArrivalPortId,
                StartTime = rentOrder.RentalStartTime,
                EndTime = rentOrder.RentalEndTime
            };
            await _shipRentalCalendarRepository.CreateAsync(entry);
        }
        else
        {
            entry.ShipId = rentOrder.ShipId.Value;
            entry.DeparturePortId = rentOrder.DeparturePortId;
            entry.ArrivalPortId = rentOrder.ArrivalPortId;
            entry.StartTime = rentOrder.RentalStartTime;
            entry.EndTime = rentOrder.RentalEndTime;
            entry.UpdatedAt = DateTime.UtcNow;
            await _shipRentalCalendarRepository.UpdateAsync(entry, entry.Id);
        }
    }
}
