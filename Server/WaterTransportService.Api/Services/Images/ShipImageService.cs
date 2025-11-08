using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

/// <summary>
/// Сервис для работы с изображениями судов.
/// </summary>
public class ShipImageService(
    IEntityRepository<ShipImage, Guid> repo,
    IFileStorageService fileStorageService) : IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto>
{
    private readonly IEntityRepository<ShipImage, Guid> _repo = repo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    public async Task<(IReadOnlyList<ShipImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<ShipImageDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<ShipImageDto?> CreateAsync(CreateShipImageDto dto)
    {
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        // Имя сохраненного файла должно быть равно GUID изображения
        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ships", newId.ToString());

        var entity = new ShipImage
        {
            Id = newId,
            ShipId = dto.ShipId,
            Ship = null!,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    public async Task<ShipImageDto?> UpdateAsync(Guid id, UpdateShipImageDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;

        if (dto.Image != null)
        {
            if (!_fileStorageService.IsValidImage(dto.Image))
                return null;

            var oldImagePath = entity.ImagePath;
            var newImagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ships", entity.Id.ToString());
            entity.ImagePath = newImagePath;

            if (!string.Equals(oldImagePath, newImagePath, StringComparison.OrdinalIgnoreCase))
            {
                await _fileStorageService.DeleteImageAsync(oldImagePath);
            }
        }

        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;

        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _repo.DeleteAsync(id);
    }

    private static ShipImageDto MapToDto(ShipImage e) => new(e.Id, e.ShipId, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
