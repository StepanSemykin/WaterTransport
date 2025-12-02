using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Сервис для работы с заказами аренды.
/// </summary>
public class RentOrderService(
    RentOrderRepository rentOrderRepository,
    IEntityRepository<Ship, Guid> shipRepository,
    IPortRepository<Guid> portRepository,
    IEntityRepository<ShipType, ushort> shipTypeRepository,
    IUserRepository<Guid> userRepository,
    IMapper mapper) : IRentOrderService
{
    private readonly RentOrderRepository _rentOrderRepository = rentOrderRepository;
    private readonly IEntityRepository<Ship, Guid> _shipRepository = shipRepository;
    private readonly IPortRepository<Guid> _portRepository = portRepository;
    private readonly IEntityRepository<ShipType, ushort> _shipTypeRepository = shipTypeRepository;
    private readonly IUserRepository<Guid> _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех заказов аренды с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _rentOrderRepository.GetAllAsync()).OrderByDescending(x => x.CreatedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(x => _mapper.Map<RentOrderDto>(x)).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    public async Task<RentOrderDto?> GetByIdAsync(Guid id)
    {
        var rentOrder = await _rentOrderRepository.GetByIdAsync(id);
        return rentOrder is null ? null : _mapper.Map<RentOrderDto>(rentOrder);
    }

    /// <summary>
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
    public async Task<IEnumerable<RentOrderDto>> GetAvailableOrdersForPartnerAsync(Guid partnerId)
    {
        // Получаем суда партнера через репозиторий
        var partnerShips = (await _shipRepository.GetAllAsync())
            .Where(s => s.UserId == partnerId)
            .ToList();

        if (partnerShips.Count == 0)
            return [];

        // Получаем заказы, которые ожидают откликов
        var availableOrders = await _rentOrderRepository.GetByStatusesAsync(
            RentOrderStatus.AwaitingPartnerResponse,
            RentOrderStatus.HasOffers);

        // Фильтруем заказы, на которые партнер может откликнуться
        var matchingOrders = availableOrders.Where(order =>
        {
            // Проверяем, что партнер еще не откликнулся на этот заказ
            if (order.Offers.Any(o => o.PartnerId == partnerId))
                return false;

            // Проверяем, что у партнера есть подходящее судно
            return partnerShips.Any(ship =>
                ship.ShipType.Id == order.ShipTypeId &&
                ship.PortId == order.DeparturePortId &&
                ship.Capacity >= order.NumberOfPassengers
            );
        });

        return matchingOrders.Select(x => _mapper.Map<RentOrderDto>(x));
    }

    /// <summary>
    /// Получить заказ пользователя по статусу.
    /// </summary>
    public async Task<IEnumerable<RentOrderDto>> GetForUserByStatusAsync(string status, Guid Id)
    {
        var result = await _rentOrderRepository.GetForUserByStatusesAsync(Id, status);
        return result.Select(x => _mapper.Map<RentOrderDto>(x));
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
    /// </summary>
    public async Task<bool> CancelOrderAsync(Guid id)
    {
        var entity = await _rentOrderRepository.GetByIdAsync(id);
        if (entity is null) return false;

        entity.Status = RentOrderStatus.Cancelled;
        entity.CancelledAt = DateTime.UtcNow;
        return await _rentOrderRepository.UpdateAsync(entity, id);
    }

    /// <summary>
    /// Удалить заказ аренды.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _rentOrderRepository.DeleteAsync(id);
}