using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Ports;

public class PortService(IEntityRepository<Port, Guid> repo) : IPortService
{
    private readonly IEntityRepository<Port, Guid> _repo = repo;

    public async Task<(IReadOnlyList<PortDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Title).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<PortDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<PortDto?> CreateAsync(CreatePortDto dto, CancellationToken ct)
    {
        var entity = new Port
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            PortTypeId = dto.PortTypeId,
            PortType = null!,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Address = dto.Address
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    public async Task<PortDto?> UpdateAsync(Guid id, UpdatePortDto dto, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Title)) entity.Title = dto.Title;
        if (dto.PortTypeId.HasValue) entity.PortTypeId = dto.PortTypeId.Value;
        if (dto.Latitude.HasValue) entity.Latitude = dto.Latitude.Value;
        if (dto.Longitude.HasValue) entity.Longitude = dto.Longitude.Value;
        if (!string.IsNullOrWhiteSpace(dto.Address)) entity.Address = dto.Address;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static PortDto MapToDto(Port e) => new(e.Id, e.Title, e.PortTypeId, e.Latitude, e.Longitude, e.Address);
}
