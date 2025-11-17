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
    IUserRepository<Guid> userRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IFileStorageService fileStorageService) : IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto>
{
    private readonly IEntityRepository<UserImage, Guid> _repo = repo;
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    /// <summary>
    /// Получить список всех изображений пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж из списка изображений и общего количества.</returns>
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
    /// Получить основное (primary) изображение пользователя по идентификатору пользователя (UserId).
    /// </summary>
    /// <param name="entityId">Идентификатор пользователя.</param>
    /// <returns>DTO основного изображения пользователя или null, если не найдено.</returns>
    public async Task<UserImageDto?> GetPrimaryImageByEntityIdAsync(Guid entityId)
    {
        if (_repo is not UserImageRepository imageRepo) return null;

        var primaryImage = await imageRepo.GetPrimaryByUserIdAsync(entityId);
        return primaryImage == null ? null : MapToDto(primaryImage);
    }

    /// <summary>
    /// Получить все изображения пользователя по идентификатору пользователя (UserId).
    /// </summary>
    /// <param name="entityId">Идентификатор пользователя.</param>
    /// <returns>Список DTO изображений пользователя.</returns>
    public async Task<IReadOnlyList<UserImageDto>> GetAllImagesByEntityIdAsync(Guid entityId)
    {
        if (_repo is not UserImageRepository imageRepo) return Array.Empty<UserImageDto>();

        var images = await imageRepo.GetAllByUserIdAsync(entityId);
        return images.Select(MapToDto).ToList();
    }

    /// <summary>
    /// Создать новое изображение пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания изображения.</param>
    /// <returns>Созданное изображение или null при ошибке.</returns>
    public async Task<UserImageDto?> CreateAsync(CreateUserImageDto dto)
    {
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        var user = await _userRepo.GetByIdAsync(dto.UserId);
        if (user is null)
            return null;

        var userProfiles = await _userProfileRepo.GetAllAsync();
        var userProfile = userProfiles.FirstOrDefault(up => up.UserId == user.Id);

        if (userProfile is null)
            return null;

        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Users", newId.ToString());

        var entity = new UserImage
        {
            Id = newId,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow,
            UserProfileId = userProfile.UserId,
            UserProfile = userProfile
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

        if (dto.Image != null)
        {
            if (!_fileStorageService.IsValidImage(dto.Image))
                return null;

            var oldImagePath = entity.ImagePath;
            var newImagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Users", entity.Id.ToString());
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

    /// <summary>
    /// Удалить изображение пользователя.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>True, если операция прошла успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;

        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _repo.DeleteAsync(id);
    }

    /// <summary>
    /// Преобразовать сущность изображения пользователя в DTO.
    /// </summary>
    private static UserImageDto MapToDto(UserImage e) => new(e.Id, e.UserProfileId, e.ImagePath, e.IsPrimary, e.UploadedAt);
}
