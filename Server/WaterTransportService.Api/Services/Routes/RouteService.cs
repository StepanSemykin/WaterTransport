using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;
using Route = WaterTransportService.Model.Entities.Route;

namespace WaterTransportService.Api.Services.Routes;

public class RouteService(IEntityRepository<Route, Guid> repo) : IRouteService
{
    private readonly IEntityRepository<Route, Guid> _repo = repo;

    public async Task<(IReadOnlyList<RouteDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Id).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<RouteDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<RouteDto?> CreateAsync(CreateRouteDto dto, CancellationToken ct)
    {
        var entity = new Route
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
        var created = await _repo.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<RouteDto?> UpdateAsync(Guid id, UpdateRouteDto dto, CancellationToken ct)
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

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static RouteDto MapToDto(Route e) => new(e.Id, e.FromPortId, e.ToPortId, e.Cost, e.ShipId, e.DurationMinutes);
}
