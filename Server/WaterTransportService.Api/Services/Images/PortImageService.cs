using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

/// <summary>
/// Сервис для работы с изображениями портов.
/// </summary>
public class PortImageService(
    IEntityRepository<PortImage, Guid> repo,
    IPortRepository<Guid> portRepo,
    IFileStorageService fileStorageService,
    IMapper mapper) : IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto>
{
    private readonly IEntityRepository<PortImage, Guid> _repo = repo;
    private readonly IPortRepository<Guid> _portRepo = portRepo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех изображений портов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком изображений и общим количеством.</returns>
    public async Task<(IReadOnlyList<PortImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(u => _mapper.Map<PortImageDto>(u)).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить изображение порта по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>DTO изображения порта или null, если не найдено.</returns>
    public async Task<PortImageDto?> GetByIdAsync(Guid id)
    {
        var portImage = await _repo.GetByIdAsync(id);
        var portImageDto = _mapper.Map<PortImageDto?>(portImage);

        return portImage is null ? null : portImageDto;
    }

    /// <summary>
    /// Получить основное (primary) изображение порта по идентификатору порта (PortId).
    /// </summary>
    /// <param name="entityId">Идентификатор порта.</param>
    /// <returns>DTO основного изображения порта или null, если не найдено.</returns>
    public async Task<PortImageDto?> GetPrimaryImageByEntityIdAsync(Guid entityId)
    {
        if (_repo is not PortImageRepository imageRepo) return null;

        var primaryImage = await imageRepo.GetPrimaryByPortIdAsync(entityId);
        return primaryImage == null ? null : _mapper.Map<PortImageDto>(primaryImage);
    }

    /// <summary>
    /// Получить все изображения порта по идентификатору порта (PortId).
    /// </summary>
    /// <param name="entityId">Идентификатор порта.</param>
    /// <returns>Список DTO изображений порта.</returns>
    public async Task<IReadOnlyList<PortImageDto>> GetAllImagesByEntityIdAsync(Guid entityId)
    {
        if (_repo is not PortImageRepository imageRepo) return Array.Empty<PortImageDto>();

        var images = await imageRepo.GetAllByPortIdAsync(entityId);
        return images.Select(img => _mapper.Map<PortImageDto>(img)).ToList();
    }

    /// <summary>
    /// Создать новое изображение порта.
    /// </summary>
    /// <param name="dto">Данные для создания изображения.</param>
    /// <returns>Созданное изображение или null при ошибке.</returns>
    public async Task<PortImageDto?> CreateAsync(CreatePortImageDto dto)
    {
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        var port = await _portRepo.GetByIdAsync(dto.PortId);
        if (port is null)
            return null;

        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ports", newId.ToString());

        var entity = new PortImage
        {
            Id = newId,
            PortId = port.Id,
            Port = port,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(entity);
        var createdDto = _mapper.Map<PortImageDto>(created);

        return createdDto;
    }

    /// <summary>
    /// Обновить изображение порта.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленное изображение или null при ошибке.</returns>
    public async Task<PortImageDto?> UpdateAsync(Guid id, UpdatePortImageDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;

        if (dto.Image != null)
        {
            if (!_fileStorageService.IsValidImage(dto.Image))
                return null;

            var oldImagePath = entity.ImagePath;
            var newImagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ports", entity.Id.ToString());
            entity.ImagePath = newImagePath;

            if (!string.Equals(oldImagePath, newImagePath, StringComparison.OrdinalIgnoreCase))
            {
                await _fileStorageService.DeleteImageAsync(oldImagePath);
            }
        }

        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;

        var updated = await _repo.UpdateAsync(entity, id);
        var updatedDto = _mapper.Map<PortImageDto>(entity);

        return updated ? updatedDto : null;
    }

    /// <summary>
    /// Удалить изображение порта.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;

        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _repo.DeleteAsync(id);
    }
}
