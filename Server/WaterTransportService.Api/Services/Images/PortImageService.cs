using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Api.Services.Ports;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

/// <summary>
/// Сервис для работы с изображениями портов.
/// </summary>
public class PortImageService(
    IEntityRepository<PortImage, Guid> portImageRepository, 
    IEntityRepository<Port, Guid> portRepository,
    IFileStorageService fileStorageService) : IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto>
{
    private readonly IEntityRepository<PortImage, Guid> _portImageRepository = portImageRepository;
    private readonly IEntityRepository<Port, Guid> _portRepository = portRepository;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

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
        var all = (await _portImageRepository.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить изображение порта по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>DTO изображения порта или null, если не найдено.</returns>
    public async Task<PortImageDto?> GetByIdAsync(Guid id)
    {
        var e = await _portImageRepository.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новое изображение порта.
    /// </summary>
    /// <param name="dto">Данные для создания изображения.</param>
    /// <returns>Созданное изображение или null при ошибке.</returns>
    public async Task<PortImageDto?> CreateAsync(CreatePortImageDto dto)
    {
        var port = await _portRepository.GetByIdAsync(dto.PortId);
        if (port is null) return null;

        // Проверяем и сохраняем изображение
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ports");

        var entity = new PortImage
        {
            Id = Guid.NewGuid(),
            PortId = dto.PortId,
            Port = port,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _portImageRepository.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить изображение порта.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленное изображение или null при ошибке.</returns>
    public async Task<PortImageDto?> UpdateAsync(Guid id, UpdatePortImageDto dto)
    {
        var entity = await _portImageRepository.GetByIdAsync(id);
        if (entity is null) return null;

        // Если предоставлено новое изображение, удаляем старое и сохраняем новое
        if (dto.Image != null)
        {
            if (!_fileStorageService.IsValidImage(dto.Image))
                return null;

            var oldImagePath = entity.ImagePath;
            var newImagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ports");
            entity.ImagePath = newImagePath;

            // Удаляем старое изображение
            await _fileStorageService.DeleteImageAsync(oldImagePath);
        }

        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;
        var ok = await _portImageRepository.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить изображение порта.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _portImageRepository.GetByIdAsync(id);
        if (entity is null) return false;

        // Удаляем файл изображения
        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _portImageRepository.DeleteAsync(id);
    }

    /// <summary>
    /// Преобразовать сущность изображения порта в DTO.
    /// </summary>
    private static PortImageDto MapToDto(PortImage e) => new(e.Id, e.PortId, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
