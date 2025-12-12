using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Extensions;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Model.Constants;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Сервис для работы с заказами аренды.
/// </summary>
public class RentOrderService(
    RentOrderRepository rentOrderRepository,
    RentOrderOfferRepository rentOrderOfferRepository,
    ShipRepository shipRepository,
    IPortRepository<Guid> portRepository,
    IEntityRepository<ShipType, ushort> shipTypeRepository,
    IUserRepository<Guid> userRepository,
    IFileStorageService fileStorageService,
    IMapper mapper) : IRentOrderService
{
    private readonly RentOrderRepository _rentOrderRepository = rentOrderRepository;
    private readonly RentOrderOfferRepository _rentOrderOfferRepository = rentOrderOfferRepository;
    private readonly ShipRepository _shipRepository = shipRepository;
    private readonly IPortRepository<Guid> _portRepository = portRepository;
    private readonly IEntityRepository<ShipType, ushort> _shipTypeRepository = shipTypeRepository;
    private readonly IUserRepository<Guid> _userRepository = userRepository;
    private readonly IFileStorageService _fileStorageService = fileStorageService;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех заказов аренды с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

        var (items, total) = await _rentOrderRepository.GetAllWithDetailsAsync(page, pageSize);
        var dtos = _mapper.Map<List<RentOrderDto>>(items);

        // Обогащаем изображениями в Base64
        for (int i = 0; i < dtos.Count; i++)
        {
            if (dtos[i].Ship != null)
            {
                var shipWithImage = await dtos[i].Ship!.WithBase64ImageAsync(_fileStorageService);
                dtos[i] = dtos[i] with { Ship = shipWithImage };
            }
        }

        return (dtos, total);
    }

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    public async Task<RentOrderDto?> GetByIdAsync(Guid id)
    {
        var e = await _rentOrderRepository.GetByIdWithDetailsAsync(id);
        if (e is null) return null;

        var dto = _mapper.Map<RentOrderDto>(e);

        // Обогащаем Ship изображением в Base64, если оно есть
        if (dto.Ship != null)
        {
            var shipWithImage = await dto.Ship.WithBase64ImageAsync(_fileStorageService);
            dto = dto with { Ship = shipWithImage };
        }

        return dto;
    }

    /// <summary>
    /// Получить доступные заказы для партнера с подходящими суднами.
    /// Получить активный заказ аренды для пользователя.
    /// </summary>
    public async Task<RentOrderDto?> GetActiveOrderForUserAsync(Guid userId)
    {
        var activeStatuses = new[]
        {
            RentOrderStatus.AwaitingPartnerResponse,
            RentOrderStatus.HasOffers
        };

        var orders = await _rentOrderRepository.GetForUserByStatusesAsync(userId, activeStatuses);
        var activeOrder = orders.OrderByDescending(o => o.CreatedAt).FirstOrDefault();

        return activeOrder is null ? null : _mapper.Map<RentOrderDto>(activeOrder);
    }

    /// <summary>
    /// Получить доступные заказы для партнеров (фильтрация по порту и типу судна).
    /// </summary>
    public async Task<IEnumerable<AvailableRentOrderDto>> GetAvailableOrdersForPartnerAsync(Guid partnerId)
    {
        // Получаем суда партнера с полными деталями через репозиторий
        var partnerShips = (await _shipRepository.GetByUserIdWithDetailsAsync(partnerId)).ToList();

        if (partnerShips.Count == 0)
            return [];

        // Получаем заказы, которые ожидают откликов
        var availableOrders = await _rentOrderRepository.GetByStatusesAsync(
            RentOrderStatus.AwaitingPartnerResponse,
            RentOrderStatus.HasOffers);

        // Формируем результат с подходящими суднами для каждого заказа
        var result = new List<AvailableRentOrderDto>();

        foreach (var order in availableOrders)
        {
            // Проверяем, что партнер еще не откликнулся на этот заказ
            if (order.Offers.Any(o => o.PartnerId == partnerId))
                continue;

            // Находим подходящие суда для этого заказа
            var matchingShips = partnerShips
                .Where(ship =>
                    ship.ShipTypeId == order.ShipTypeId &&
                    ship.PortId == order.DeparturePortId &&
                    ship.Capacity >= order.NumberOfPassengers)
                .ToList();

            // Добавляем заказ только если есть подходящие суда
            if (matchingShips.Count > 0)
            {
                var mappedShips = _mapper.Map<List<ShipDetailsDto>>(matchingShips);

                // Обогащаем суда изображениями в Base64
                var shipsWithImages = await mappedShips.WithBase64ImagesAsync(_fileStorageService);

                var orderDto = new AvailableRentOrderDto(
                    order.Id,
                    order.UserId,
                    _mapper.Map<UserProfileDto>(order.User?.UserProfile),
                    order.ShipTypeId,
                    order.ShipType?.Name,
                    order.DeparturePortId,
                    _mapper.Map<PortDto>(order.DeparturePort),
                    order.ArrivalPortId,
                    _mapper.Map<PortDto>(order.ArrivalPort),
                    order.NumberOfPassengers,
                    order.RentalStartTime,
                    order.RentalEndTime,
                    order.Status,
                    order.CreatedAt,
                    shipsWithImages
                );
                result.Add(orderDto);
            }
        }

        return result;
    }

    /// <summary>
    /// Получить заказ пользователя по статусу.
    /// </summary>
    public async Task<IEnumerable<RentOrderDto>> GetForUserByStatusAsync(string status, Guid Id)
    {
        var result = await _rentOrderRepository.GetForUserByStatusWithDetailsAsync(Id, status);
        var dtos = _mapper.Map<List<RentOrderDto>>(result);

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
    /// Получить заказ партнера по статусу.
    /// </summary>
    public async Task<IEnumerable<RentOrderDto>> GetForPartnerByStatusAsync(string status, Guid Id)
    {
        var result = await _rentOrderRepository.GetForPartnerByStatusWithDetailsAsync(Id, status);
        var dtos = _mapper.Map<List<RentOrderDto>>(result);

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
    /// Создать новый заказ аренды.
    /// </summary>
    public async Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto, Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null) return null;
        if (dto.Duration != null)
        {
            dto.RentalEndTime = dto.RentalStartTime + dto.Duration;
        }
        // Проверяем существование порта отправления
        var departurePort = await _portRepository.GetByIdAsync(dto.DeparturePortId);
        if (departurePort is null) return null;

        // Проверяем существование порта прибытия (если указан)
        Port? arrivalPort = null;

        if (dto.ArrivalPortId != null)
        {
            arrivalPort = await _portRepository.GetByIdAsync(dto.ArrivalPortId.Value);
        }


        // Проверяем существование типа судна
        var shipType = await _shipTypeRepository.GetByIdAsync(dto.ShipTypeId);
        if (shipType is null) return null;

        var entity = new RentOrder
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            User = user,
            ShipTypeId = dto.ShipTypeId,
            ShipType = shipType,
            DeparturePortId = dto.DeparturePortId,
            DeparturePort = departurePort,
            ArrivalPortId = arrivalPort?.Id,
            ArrivalPort = arrivalPort,
            NumberOfPassengers = dto.NumberOfPassengers,
            RentalStartTime = dto.RentalStartTime,
            RentalEndTime = dto.RentalEndTime,
            Status = RentOrderStatus.AwaitingPartnerResponse,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _rentOrderRepository.CreateAsync(entity);
        var createdDto = _mapper.Map<RentOrderDto>(created);

        return createdDto;
    }

    /// <summary>
    /// Обновить существующий заказ аренды.
    /// </summary>
    public async Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto)
    {
        var entity = await _rentOrderRepository.GetByIdAsync(id);
        if (entity is null) return null;

        if (dto.PartnerId.HasValue) entity.PartnerId = dto.PartnerId.Value;
        if (dto.ShipId.HasValue) entity.ShipId = dto.ShipId.Value;
        if (dto.TotalPrice.HasValue) entity.TotalPrice = dto.TotalPrice.Value;
        if (dto.NumberOfPassengers.HasValue) entity.NumberOfPassengers = dto.NumberOfPassengers.Value;
        if (dto.RentalStartTime.HasValue) entity.RentalStartTime = dto.RentalStartTime.Value;
        if (dto.RentalEndTime.HasValue) entity.RentalEndTime = dto.RentalEndTime.Value;
        if (dto.OrderDate.HasValue) entity.OrderDate = dto.OrderDate.Value;
        if (!string.IsNullOrWhiteSpace(dto.Status)) entity.Status = dto.Status;
        //if (dto.CancelledAt.HasValue) entity.CancelledAt = dto.CancelledAt.Value;

        var ok = await _rentOrderRepository.UpdateAsync(entity, id);

        return ok ? _mapper.Map<RentOrderDto>(entity) : null;
    }

    /// <summary>
    /// Завершить аренду (пользователь подтверждает завершение).
    /// </summary>
    public async Task<bool> CompleteOrderAsync(Guid id)
    {
        var entity = await _rentOrderRepository.GetByIdAsync(id);
        if (entity is null || entity.Status != RentOrderStatus.Agreed)
            return false;

        entity.Status = RentOrderStatus.Completed;
        return await _rentOrderRepository.UpdateAsync(entity, id);
    }

    /// <summary>
    /// Отменить заказ аренды.
    /// При отмене удаляются все отклики партнеров на этот заказ.
    /// </summary>
    public async Task<bool> CancelOrderAsync(Guid id)
    {
        var entity = await _rentOrderRepository.GetByIdAsync(id);
        if (entity is null) return false;
        // Отменяем все отклики на этот заказ
        await _rentOrderOfferRepository.RejectByRentOrderIdAsync(id);


        entity.Status = RentOrderStatus.Cancelled;
        entity.CancelledAt = DateTime.UtcNow;
        return await _rentOrderRepository.UpdateAsync(entity, id);
    }

    /// <summary>
    /// Удалить заказ аренды.
    /// При удалении удаляются все отклики партнеров на этот заказ.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id)
    {
        // Удаляем все отклики на этот заказ
        await _rentOrderOfferRepository.DeleteByRentOrderIdAsync(id);

        return await _rentOrderRepository.DeleteAsync(id);
    }
}