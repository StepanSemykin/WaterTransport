using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Ships;

public class ShipTypeService(IEntityRepository<ShipType, ushort> repo) : IShipTypeService
{
    private readonly IEntityRepository<ShipType, ushort> _repo = repo;

    public async Task<(IReadOnlyList<ShipTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Name).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<ShipTypeDto?> GetByIdAsync(ushort id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<ShipTypeDto?> CreateAsync(CreateShipTypeDto dto)
    {
        var entity = new ShipType
        {
            Id = dto.Id,
            Name = dto.Name,
            Description = dto.Description
        };
        var created = await _repo.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<ShipTypeDto?> UpdateAsync(ushort id, UpdateShipTypeDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Name)) entity.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Description)) entity.Description = dto.Description;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(ushort id) => _repo.DeleteAsync(id);

    private static ShipTypeDto MapToDto(ShipType e) => new(e.Id, e.Name, e.Description);
}
