using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Ships;

/// <summary>
/// Сервис для работы с кораблями.
/// </summary>
public class ShipService(IEntityRepository<Ship, Guid> repo) : IShipService
{
    private readonly IEntityRepository<Ship, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех кораблей с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<ShipDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Name).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить корабль по идентификатору.
    /// </summary>
    public async Task<ShipDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый корабль.
    /// </summary>
    public async Task<ShipDto?> CreateAsync(CreateShipDto dto)
    {
        var entity = new Ship
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            ShipTypeId = dto.ShipTypeId,
            ShipType = null!,
            Capacity = dto.Capacity,
            RegistrationNumber = dto.RegistrationNumber,
            YearOfManufacture = dto.YearOfManufacture,
            MaxSpeed = dto.MaxSpeed,
            Width = dto.Width,
            Length = dto.Length,
            Description = dto.Description,
            CostPerHour = dto.CostPerHour,
            PortId = dto.PortId,
            Port = null!,
            UserId = dto.UserId,
            User = null!
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить существующий корабль.
    /// </summary>
    public async Task<ShipDto?> UpdateAsync(Guid id, UpdateShipDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Name)) entity.Name = dto.Name;
        if (dto.ShipTypeId.HasValue) entity.ShipTypeId = dto.ShipTypeId.Value;
        if (dto.Capacity.HasValue) entity.Capacity = dto.Capacity.Value;
        if (!string.IsNullOrWhiteSpace(dto.RegistrationNumber)) entity.RegistrationNumber = dto.RegistrationNumber;
        if (dto.YearOfManufacture.HasValue) entity.YearOfManufacture = dto.YearOfManufacture.Value;
        if (dto.MaxSpeed.HasValue) entity.MaxSpeed = dto.MaxSpeed.Value;
        if (dto.Width.HasValue) entity.Width = dto.Width.Value;
        if (dto.Length.HasValue) entity.Length = dto.Length.Value;
        if (!string.IsNullOrWhiteSpace(dto.Description)) entity.Description = dto.Description;
        if (dto.CostPerHour.HasValue) entity.CostPerHour = dto.CostPerHour.Value;
        if (dto.PortId.HasValue) entity.PortId = dto.PortId.Value;
        if (dto.UserId.HasValue) entity.UserId = dto.UserId.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить корабль.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность корабля в DTO.
    /// </summary>
    private static ShipDto MapToDto(Ship e) => new(
        e.Id,
        e.Name,
        e.ShipTypeId,
        e.Capacity,
        e.RegistrationNumber,
        e.YearOfManufacture,
        e.MaxSpeed,
        e.Width,
        e.Length,
        e.Description,
        e.CostPerHour,
        e.PortId,
        e.UserId);
}
