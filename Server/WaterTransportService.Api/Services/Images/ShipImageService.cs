using AutoMapper;
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
    IEntityRepository<Ship, Guid> shipRepo,
    IFileStorageService fileStorageService,
    IMapper mapper) : IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto>
{
    private readonly IEntityRepository<ShipImage, Guid> _repo = repo;
    private readonly IEntityRepository<Ship, Guid> _shipRepo = shipRepo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;
    private readonly IMapper _mapper = mapper;

    public async Task<(IReadOnlyList<ShipImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(u => _mapper.Map<ShipImageDto>(u)).ToList();
        return (items, total);
    }

    public async Task<ShipImageDto?> GetByIdAsync(Guid id)
    {
        var shipImage = await _repo.GetByIdAsync(id);
        var shipImageDto = _mapper.Map<ShipImageDto?>(shipImage);

        return shipImage is null ? null : shipImageDto;
    }

    /// <summary>
    /// Получить основное (primary) изображение судна по идентификатору судна (ShipId).
    /// </summary>
    /// <param name="entityId">Идентификатор судна.</param>
    /// <returns>DTO основного изображения судна или null, если не найдено.</returns>
    public async Task<ShipImageDto?> GetPrimaryImageByEntityIdAsync(Guid entityId)
    {
        if (_repo is not ShipImageRepository imageRepo) return null;

        var primaryImage = await imageRepo.GetPrimaryByShipIdAsync(entityId);
        return primaryImage == null ? null : _mapper.Map<ShipImageDto>(primaryImage);
    }

    /// <summary>
    /// Получить все изображения судна по идентификатору судна (ShipId).
    /// </summary>
    /// <param name="entityId">Идентификатор судна.</param>
    /// <returns>Список DTO изображений судна.</returns>
    public async Task<IReadOnlyList<ShipImageDto>> GetAllImagesByEntityIdAsync(Guid entityId)
    {
        if (_repo is not ShipImageRepository imageRepo) return Array.Empty<ShipImageDto>();

        var images = await imageRepo.GetAllByShipIdAsync(entityId);
        return images.Select(img => _mapper.Map<ShipImageDto>(img)).ToList();
    }

    public async Task<ShipImageDto?> CreateAsync(CreateShipImageDto dto)
    {
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        var ship = await _shipRepo.GetByIdAsync(dto.ShipId);
        if (ship is null)
            return null;

        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ships", newId.ToString());

        var entity = new ShipImage
        {
            Id = newId,
            ShipId = ship.Id,
            Ship = null!,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(entity);
        var createdDto = _mapper.Map<ShipImageDto>(created);

        return createdDto;
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

        var updated = await _repo.UpdateAsync(entity, id);
        var updatedDto = _mapper.Map<ShipImageDto>(updated);

        return updated ? updatedDto : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;

        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _repo.DeleteAsync(id);
    }
}
