using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Repositories.EntitiesRepository;
using RouteEntity = WaterTransportService.Model.Entities.Route;

namespace WaterTransportService.Api.Services.Routes;

/// <summary>
/// Сервис для работы с маршрутами.
/// </summary>
public class RouteService(IEntityRepository<RouteEntity, Guid> repo) : IRouteService
{
    private readonly IEntityRepository<RouteEntity, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех маршрутов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RouteDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Id).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить маршрут по идентификатору.
    /// </summary>
    public async Task<RouteDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый маршрут.
    /// </summary>
    public async Task<RouteDto?> CreateAsync(CreateRouteDto dto)
    {
        var entity = new RouteEntity
        {
            Id = Guid.NewGuid(),
            FromPortId = dto.FromPortId,
            FromPort = null!,
            ToPortId = dto.ToPortId,
            ToPort = null,
            Cost = dto.Cost,
            ShipId = dto.ShipId,
            Ship = null!,
            DurationMinutes = dto.DurationMinutes
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить существующий маршрут.
    /// </summary>
    public async Task<RouteDto?> UpdateAsync(Guid id, UpdateRouteDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.FromPortId.HasValue) entity.FromPortId = dto.FromPortId.Value;
        if (dto.ToPortId.HasValue) entity.ToPortId = dto.ToPortId.Value;
        if (dto.Cost.HasValue) entity.Cost = dto.Cost.Value;
        if (dto.ShipId.HasValue) entity.ShipId = dto.ShipId.Value;
        if (dto.DurationMinutes.HasValue) entity.DurationMinutes = dto.DurationMinutes.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить маршрут.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность маршрута в DTO.
    /// </summary>
    private static RouteDto MapToDto(RouteEntity e) => new(e.Id, e.FromPortId, e.ToPortId, e.Cost, e.ShipId, e.DurationMinutes);
}
