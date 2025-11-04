using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Images;

/// <summary>
/// Сервис для работы с изображениями пользователей.
/// </summary>
public class UserImageService(
    IEntityRepository<UserImage, Guid> repo,
    IFileStorageService fileStorageService) : IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto>
{
    private readonly IEntityRepository<UserImage, Guid> _repo = repo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    /// <summary>
    /// Получить список всех изображений пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком изображений и общим количеством.</returns>
    public async Task<(IReadOnlyList<UserImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить изображение пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>DTO изображения пользователя или null, если не найдено.</returns>
    public async Task<UserImageDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новое изображение пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания изображения.</param>
    /// <returns>Созданное изображение или null при ошибке.</returns>
    public async Task<UserImageDto?> CreateAsync(CreateUserImageDto dto)
    {
        // Проверяем и сохраняем изображение
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Users");

        var entity = new UserImage
        {
            Id = Guid.NewGuid(),
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow,
            UserProfileId = dto.UserProfileId
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить изображение пользователя.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленное изображение или null при ошибке.</returns>
    public async Task<UserImageDto?> UpdateAsync(Guid id, UpdateUserImageDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;

        // Если предоставлено новое изображение, удаляем старое и сохраняем новое
        if (dto.Image != null)
        {
            if (!_fileStorageService.IsValidImage(dto.Image))
                return null;

            var oldImagePath = entity.ImagePath;
            var newImagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Users");
            entity.ImagePath = newImagePath;

            // Удаляем старое изображение
            await _fileStorageService.DeleteImageAsync(oldImagePath);
        }

        if (dto.IsPrimary.HasValue) entity.IsPrimary = dto.IsPrimary.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить изображение пользователя.
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
    /// Преобразовать сущность изображения пользователя в DTO.
    /// </summary>
    private static UserImageDto MapToDto(UserImage e) => new(e.Id, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
