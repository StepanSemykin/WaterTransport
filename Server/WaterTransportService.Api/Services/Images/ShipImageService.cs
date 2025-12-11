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

    /// <summary>
    /// Получить список всех изображений судов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (начиная с 1).</param>
    /// <param name="pageSize">Размер страницы (максимум 100).</param>
    /// <returns>Кортеж с коллекцией изображений и общим количеством.</returns>
    public async Task<(IReadOnlyList<ShipImageDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.UploadedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(u => _mapper.Map<ShipImageDto>(u)).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить изображение судна по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>DTO изображения судна или null, если не найдено.</returns>
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

    /// <summary>
    /// Создать новое изображение судна.
    /// </summary>
    /// <param name="dto">Данные для создания изображения (судно, файл, флаг primary).</param>
    /// <returns>Созданное изображение судна или null при ошибке валидации.</returns>
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
            Ship = ship,
            ImagePath = imagePath,
            IsPrimary = dto.IsPrimary,
            UploadedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(entity);
        var createdDto = _mapper.Map<ShipImageDto>(created);

        return createdDto;
    }

    /// <summary>
    /// Обновить или установить основное (primary) изображение судна.
    /// </summary>
    /// <param name="id">Идентификатор судна (ShipId).</param>
    /// <param name="dto">Данные для обновления (новый файл изображения).</param>
    /// <returns>Обновленное или созданное DTO изображения судна или null при ошибке валидации.</returns>
    /// <remarks>
    /// Метод работает с primary изображением судна:
    /// - Если у судна уже есть primary изображение, оно будет заменено на новое (старое становится не primary).
    /// - Если у судна нет primary изображения, создается новое с флагом IsPrimary = true.
    /// - Старое primary изображение сохраняется на диске как обычное изображение (не primary).
    /// - У судна может быть только одно primary изображение.
    /// </remarks>
    public async Task<ShipImageDto?> UpdateAsync(Guid id, UpdateShipImageDto dto)
    {
        // Проверяем, что передано изображение
        if (dto.Image == null)
            return null;
        
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;
        
        // Проверяем существование судна
        var ship = await _shipRepo.GetByIdAsync(id);
        if (ship is null)
            return null;
        
        // Проверяем, есть ли репозиторий нужного типа
        if (_repo is not ShipImageRepository imageRepo)
            return null;
        
        // Получаем текущее primary изображение судна
        var currentPrimaryImage = await imageRepo.GetPrimaryByShipIdAsync(id);
        
        // Если у судна уже есть primary изображение
        if (currentPrimaryImage != null)
        {
            // Сбрасываем флаг IsPrimary у старого изображения (файл остается на диске)
            currentPrimaryImage.IsPrimary = false;
            await _repo.UpdateAsync(currentPrimaryImage, currentPrimaryImage.Id);
        }
        
        // Создаем новое primary изображение
        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ships", newId.ToString());
        
        var newPrimaryImage = new ShipImage
        {
            Id = newId,
            ShipId = ship.Id,
            Ship = ship,
            ImagePath = imagePath,
            IsPrimary = true, // Новое изображение всегда primary
            UploadedAt = DateTime.UtcNow
        };
        
        var created = await _repo.CreateAsync(newPrimaryImage);
        
        var createdDto = _mapper.Map<ShipImageDto>(created);
        return createdDto;
    }

    /// <summary>
    /// Удалить изображение судна по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения для удаления.</param>
    /// <returns>True, если удаление успешно, иначе false.</returns>
    /// <remarks>
    /// Также удаляет физический файл изображения с диска.
    /// </remarks>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;

        await _fileStorageService.DeleteImageAsync(entity.ImagePath);

        return await _repo.DeleteAsync(id);
    }
}
