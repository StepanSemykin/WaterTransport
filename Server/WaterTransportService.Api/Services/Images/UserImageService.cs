using AutoMapper;
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
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IFileStorageService fileStorageService,
    IMapper mapper) : IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto>
{
    private readonly IEntityRepository<UserImage, Guid> _repo = repo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IFileStorageService _fileStorageService = fileStorageService;
    private readonly IMapper _mapper = mapper;

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
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(x => _mapper.Map<UserImageDto>(x)).ToList();
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
        return e is null ? null : _mapper.Map<UserImageDto>(e);
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
        return primaryImage == null ? null : _mapper.Map<UserImageDto>(primaryImage);
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
        return images.Select(x => _mapper.Map<UserImageDto>(x)).ToList();
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

        var userProfile = await _userProfileRepo.GetByIdAsync(dto.UserId);

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
        return _mapper.Map<UserImageDto>(created);
    }

    /// <summary>
    /// Обновить или установить основное (primary) изображение пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя (UserId).</param>
    /// <param name="dto">Данные для обновления (новый файл изображения).</param>
    /// <returns>Обновленное или созданное DTO изображения пользователя или null при ошибке валидации.</returns>
    /// <remarks>
    /// Метод работает с primary изображением пользователя:
    /// - Если у пользователя уже есть primary изображение, оно будет заменено на новое (старое становится не primary).
    /// - Если у пользователя нет primary изображения, создается новое с флагом IsPrimary = true.
    /// - Старое primary изображение сохраняется на диске как обычное изображение (не primary).
    /// - У пользователя может быть только одно primary изображение.
    /// </remarks>
    public async Task<UserImageDto?> UpdateAsync(Guid id, UpdateUserImageDto dto)
    {
        // Проверяем, что передано изображение
        if (dto.Image == null)
            return null;

        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;

        // Проверяем существование профиля пользователя
        var userProfile = await _userProfileRepo.GetByIdAsync(id);
        if (userProfile is null)
            return null;

        // Проверяем, есть ли репозиторий нужного типа
        if (_repo is not UserImageRepository imageRepo)
            return null;

        // Получаем текущее primary изображение пользователя
        var currentPrimaryImage = await imageRepo.GetPrimaryByUserIdAsync(id);

        // Если у пользователя уже есть primary изображение
        if (currentPrimaryImage != null)
        {
            // Сбрасываем флаг IsPrimary у старого изображения (файл остается на диске)
            currentPrimaryImage.IsPrimary = false;
            await _repo.UpdateAsync(currentPrimaryImage, currentPrimaryImage.Id);
        }

        // Создаем новое primary изображение
        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Users", newId.ToString());

        var newPrimaryImage = new UserImage
        {
            Id = newId,
            ImagePath = imagePath,
            IsPrimary = true, // Новое изображение всегда primary
            UploadedAt = DateTime.UtcNow,
            UserProfileId = userProfile.UserId,
            UserProfile = userProfile
        };

        var created = await _repo.CreateAsync(newPrimaryImage);

        var createdDto = _mapper.Map<UserImageDto>(created);
        return createdDto;
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
}
