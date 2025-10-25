using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

public class ShipImageService(IEntityRepository<ShipImage, Guid> repo) : IImageService<ShipImageDto, CreatePortImageDto, UpdatePortImageDto>
{
    private readonly IEntityRepository<ShipImage, Guid> _repo = repo;

    public async Task<(IReadOnlyList<ShipImageDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<ShipImageDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<ShipImageDto?> CreateAsync(CreateShipImageDto dto, CancellationToken ct)
    {
        var entity = new ShipImage
        {
            Id = Guid.NewGuid(),
            ShipId = dto.ShipId,
            Ship = null!,
            ImagePath = dto.ImagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<ShipImageDto?> UpdateAsync(Guid id, UpdateShipImageDto dto, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.ImagePath)) entity.ImagePath = dto.ImagePath;
        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static ShipImageDto MapToDto(ShipImage e) => new(e.Id, e.ShipId, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
