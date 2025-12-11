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
    /// Обновить или установить основное (primary) изображение порта.
    /// </summary>
    /// <param name="id">Идентификатор порта (PortId).</param>
    /// <param name="dto">Данные для обновления (новый файл изображения).</param>
    /// <returns>Обновленное или созданное DTO изображения порта или null при ошибке валидации.</returns>
    /// <remarks>
    /// Метод работает с primary изображением порта:
    /// - Если у порта уже есть primary изображение, оно будет заменено на новое (старое становится не primary).
    /// - Если у порта нет primary изображения, создается новое с флагом IsPrimary = true.
    /// - Старое primary изображение сохраняется на диске как обычное изображение (не primary).
    /// - У порта может быть только одно primary изображение.
    /// </remarks>
    public async Task<PortImageDto?> UpdateAsync(Guid id, UpdatePortImageDto dto)
    {
        // Проверяем, что передано изображение
        if (dto.Image == null)
            return null;
        
        if (!_fileStorageService.IsValidImage(dto.Image))
            return null;
        
        // Проверяем существование порта
        var port = await _portRepo.GetByIdAsync(id);
        if (port is null)
            return null;
        
        // Проверяем, есть ли репозиторий нужного типа
        if (_repo is not PortImageRepository imageRepo)
            return null;
        
        // Получаем текущее primary изображение порта
        var currentPrimaryImage = await imageRepo.GetPrimaryByPortIdAsync(id);
        
        // Если у порта уже есть primary изображение
        if (currentPrimaryImage != null)
        {
            // Сбрасываем флаг IsPrimary у старого изображения (файл остается на диске)
            currentPrimaryImage.IsPrimary = false;
            await _repo.UpdateAsync(currentPrimaryImage, currentPrimaryImage.Id);
        }
        
        // Создаем новое primary изображение
        var newId = Guid.NewGuid();
        var imagePath = await _fileStorageService.SaveImageAsync(dto.Image, "Ports", newId.ToString());
        
        var newPrimaryImage = new PortImage
        {
            Id = newId,
            PortId = port.Id,
            Port = port,
            ImagePath = imagePath,
            IsPrimary = true, // Новое изображение всегда primary
            UploadedAt = DateTime.UtcNow
        };
        
        var created = await _repo.CreateAsync(newPrimaryImage);
        
        var createdDto = _mapper.Map<PortImageDto>(created);
        return createdDto;
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
