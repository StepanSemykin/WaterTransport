using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

/// <summary>
/// Сервис для работы с изображениями кораблей.
/// </summary>
public class ShipImageService(
    IEntityRepository<ShipImage, Guid> repo,
    IFileStorageService fileStorageService) : IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto>
{
    private readonly IEntityRepository<ShipImage, Guid> _repo = repo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    /// <summary>
    /// Получить список всех изображений кораблей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком изображений и общим количеством.</returns>
    public async Task<(IReadOnlyList<ShipImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить изображение корабля по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>DTO изображения корабля или null, если не найдено.</returns>
    public async Task<ShipImageDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новое изображение корабля.
    /// </summary>
    /// <param name="dto">Данные для создания изображения.</param>
    /// <returns>Созданное изображение или null при ошибке.</returns>
    public async Task<ShipImageDto?> CreateAsync(CreateShipImageDto dto)
    {
        // Проверяем и сохраняем изображение
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ships");

        var entity = new ShipImage
        {
            Id = Guid.NewGuid(),
            ShipId = dto.ShipId,
            Ship = null!,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить изображение корабля.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленное изображение или null при ошибке.</returns>
    public async Task<ShipImageDto?> UpdateAsync(Guid id, UpdateShipImageDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;

        // Если предоставлено новое изображение, удаляем старое и сохраняем новое
        if (dto.Image != null)
        {
            if (!_fileStorageService.IsValidImage(dto.Image))
                return null;

            var oldImagePath = entity.ImagePath;
            var newImagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ships");
            entity.ImagePath = newImagePath;

            // Удаляем старое изображение
            await _fileStorageService.DeleteImageAsync(oldImagePath);
        }

        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить изображение корабля.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;

        // Удаляем файл изображения
        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _repo.DeleteAsync(id);
    }

    /// <summary>
    /// Преобразовать сущность изображения корабля в DTO.
    /// </summary>
    private static ShipImageDto MapToDto(ShipImage e) => new(e.Id, e.ShipId, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
