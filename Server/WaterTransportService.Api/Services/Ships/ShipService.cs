using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Middleware.Exceptions;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Ships;

/// <summary>
/// Сервис для работы с судами.
/// </summary>
public class ShipService(
    IEntityRepository<Ship, Guid> repo,
    IPortRepository<Guid> portRepo,
    IUserRepository<Guid> userRepo,
    IEntityRepository<ShipType, ushort> shipTypeRepo,
    IMapper mapper) : IShipService
{
    private readonly IEntityRepository<Ship, Guid> _repo = repo;
    private readonly IPortRepository<Guid> _portRepo = portRepo;
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<ShipType, ushort> _shipTypeRepo = shipTypeRepo;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех судов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<Ship> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Name).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(u => u).ToList();

        return (items, total);
    }

    /// <summary>
    /// Получить судно по идентификатору.
    /// </summary>
    public async Task<ShipDto?> GetByIdAsync(Guid id)
    {
        var ship = await _repo.GetByIdAsync(id);
        var shipDto = _mapper.Map<ShipDto?>(ship);

        return ship is null ? null : shipDto;
    }

    /// <summary>
    /// Получить все суда конкретного пользователя по его userId (из токена).
    /// </summary>
    public async Task<(IReadOnlyList<ShipDto> Items, int Total)> GetByUserAsync(Guid userId, int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);

        var all = (await _repo.GetAllAsync())
            .Where(s => s.UserId == userId)
            .ToList();

        var ordered = all.OrderBy(s => s.Name).ToList();
        var total = ordered.Count;
        var skip = (page - 1) * pageSize;

        var items = ordered
            .Skip(skip)
            .Take(pageSize)
            .Select(s => _mapper.Map<ShipDto>(s))
            .ToList();

        return (items, total);
    }

    /// <summary>
    /// Создать новое судно.
    /// </summary>
    public async Task<ShipDto?> CreateAsync(CreateShipDto dto)
    {
        var port = await _portRepo.GetByIdAsync(dto.PortId);
        if (port is null)
            return null;

        var user = await _userRepo.GetByIdAsync(dto.UserId);
        if (user is null)
            return null;

        var shipType = await _shipTypeRepo.GetByIdAsync(dto.ShipTypeId);
        if (shipType is null)
            return null;

        var normalizedRegistrationNumber = dto.RegistrationNumber.Trim();
        await EnsureRegistrationNumberUniqueAsync(normalizedRegistrationNumber);

        var entity = new Ship
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            ShipTypeId = dto.ShipTypeId,
            ShipType = shipType,
            Capacity = dto.Capacity,
            RegistrationNumber = normalizedRegistrationNumber,
            YearOfManufacture = dto.YearOfManufacture,
            MaxSpeed = dto.MaxSpeed,
            Width = dto.Width,
            Length = dto.Length,
            Description = dto.Description,
            CostPerHour = dto.CostPerHour,
            PortId = port.Id,
            Port = port,
            UserId = user.Id,
            User = user
        };

        var created = await _repo.CreateAsync(entity);
        var createdDto = _mapper.Map<ShipDto>(created);

        return createdDto;
    }

    /// <summary>
    /// Обновить существующее судно.
    /// </summary>
    public async Task<ShipDto?> UpdateAsync(Guid id, UpdateShipDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Name)) entity.Name = dto.Name;
        if (dto.ShipTypeId.HasValue) entity.ShipTypeId = dto.ShipTypeId.Value;
        if (dto.Capacity.HasValue) entity.Capacity = dto.Capacity.Value;
        if (!string.IsNullOrWhiteSpace(dto.RegistrationNumber))
        {
            var normalizedRegistrationNumber = dto.RegistrationNumber.Trim();
            await EnsureRegistrationNumberUniqueAsync(normalizedRegistrationNumber, id);
            entity.RegistrationNumber = normalizedRegistrationNumber;
        }
        if (dto.YearOfManufacture.HasValue) entity.YearOfManufacture = dto.YearOfManufacture.Value;
        if (dto.MaxSpeed.HasValue) entity.MaxSpeed = dto.MaxSpeed.Value;
        if (dto.Width.HasValue) entity.Width = dto.Width.Value;
        if (dto.Length.HasValue) entity.Length = dto.Length.Value;
        if (!string.IsNullOrWhiteSpace(dto.Description)) entity.Description = dto.Description;
        if (dto.CostPerHour.HasValue) entity.CostPerHour = dto.CostPerHour.Value;

        if (dto.PortId.HasValue)
        {
            var port = await _portRepo.GetByIdAsync(dto.PortId.Value);
            if (port is null) return null;
            entity.PortId = port.Id;
        }

        if (dto.UserId.HasValue)
        {
            var user = await _userRepo.GetByIdAsync(dto.UserId.Value);
            if (user is null) return null;
            entity.UserId = user.Id;
        }

        var updated = await _repo.UpdateAsync(entity, id);
        var updatedDto = _mapper.Map<ShipDto>(entity);

        return updated ? updatedDto : null;
    }

    /// <summary>
    /// Получить судно по регистрационному номеру.
    /// </summary>
    public async Task<ShipDto?> GetByRegistrationNumberAsync(string registrationNumber)
    {
        var all = await _repo.GetAllAsync();
        var ship = all.FirstOrDefault(s => s.RegistrationNumber == registrationNumber);

        if (ship is null)
            return null;

        var shipDto = _mapper.Map<ShipDto>(ship);
        return shipDto;
    }

    /// <summary>
    /// Удалить судно.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    private async Task EnsureRegistrationNumberUniqueAsync(string registrationNumber, Guid? shipIdToExclude = null)
    {
        var normalizedRegistrationNumber = registrationNumber.Trim();
        var ships = await _repo.GetAllAsync();
        var duplicateExists = ships.Any(s =>
            (!shipIdToExclude.HasValue || s.Id != shipIdToExclude.Value) &&
            !string.IsNullOrWhiteSpace(s.RegistrationNumber) &&
            string.Equals(s.RegistrationNumber, normalizedRegistrationNumber, StringComparison.OrdinalIgnoreCase));

        if (duplicateExists)
        {
            throw new DuplicateFieldValueException("регистрационным номером судна", normalizedRegistrationNumber);
        }
    }
}
