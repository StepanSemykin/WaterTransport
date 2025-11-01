using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

public class PortImageService(IEntityRepository<PortImage, Guid> repo) : IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto>
{
    private readonly IEntityRepository<PortImage, Guid> _repo = repo;

    public async Task<(IReadOnlyList<PortImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<PortImageDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<PortImageDto?> CreateAsync(CreatePortImageDto dto)
    {
        var entity = new PortImage
        {
            Id = Guid.NewGuid(),
            PortId = dto.PortId,
            Port = null!,
            ImagePath = dto.ImagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<PortImageDto?> UpdateAsync(Guid id, UpdatePortImageDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.ImagePath)) entity.ImagePath = dto.ImagePath;
        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    private static PortImageDto MapToDto(PortImage e) => new(e.Id, e.PortId, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
