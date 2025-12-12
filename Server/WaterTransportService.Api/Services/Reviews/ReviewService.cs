using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Reviews;

/// <summary>
/// Сервис для работы с отзывами.
/// </summary>
public class ReviewService(
    IReviewRepository repo,
    IUserRepository<Guid> userRepo,
    IEntityRepository<Ship, Guid> shipRepo,
    IPortRepository<Guid> portRepo,
    IEntityRepository<RentOrder, Guid> rentOrderRepo,
    IMapper mapper) : IReviewService
{
    private readonly IReviewRepository _repo = repo;
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<Ship, Guid> _shipRepo = shipRepo;
    private readonly IPortRepository<Guid> _portRepo = portRepo;
    private readonly IEntityRepository<RentOrder, Guid> _rentOrderRepo = rentOrderRepo;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех отзывов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<ReviewDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

        var total = await _repo.GetActiveCountAsync();
        var skip = (page - 1) * pageSize;
        var reviews = await _repo.GetAllActiveAsync(skip, pageSize);

        var items = reviews
            .Select(r => _mapper.Map<ReviewDto>(r))
            .ToList();

        return (items, total);
    }

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    public async Task<ReviewDto?> GetByIdAsync(Guid id)
    {
        var review = await _repo.GetByIdAsync(id);
        return review is null ? null : _mapper.Map<ReviewDto>(review);
    }

    /// <summary>
    /// Получить все отзывы о конкретном пользователе-партнере.
    /// </summary>
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByUserIdAsync(Guid userId)
    {
        var reviews = await _repo.GetReviewsByUserIdAsync(userId);
        return reviews.Select(r => _mapper.Map<ReviewDto>(r)).ToList();
    }

    /// <summary>
    /// Получить все отзывы о конкретном судне.
    /// </summary>
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByShipIdAsync(Guid shipId)
    {
        var reviews = await _repo.GetReviewsByShipIdAsync(shipId);
        return reviews.Select(r => _mapper.Map<ReviewDto>(r)).ToList();
    }

    /// <summary>
    /// Получить все отзывы о конкретном порте.
    /// </summary>
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByPortIdAsync(Guid portId)
    {
        var reviews = await _repo.GetReviewsByPortIdAsync(portId);
        return reviews.Select(r => _mapper.Map<ReviewDto>(r)).ToList();
    }

    /// <summary>
    /// Получить средний рейтинг пользователя-партнеры.
    /// </summary>
    public async Task<AverageRatingDto> GetAverageRatingForUserAsync(Guid userId)
    {
        var (average, count) = await _repo.GetAverageRatingForUserAsync(userId);
        return new AverageRatingDto(average, count);
    }

    /// <summary>
    /// Получить средний рейтинг судна.
    /// </summary>
    public async Task<AverageRatingDto> GetAverageRatingForShipAsync(Guid shipId)
    {
        var (average, count) = await _repo.GetAverageRatingForShipAsync(shipId);
        return new AverageRatingDto(average, count);
    }

    /// <summary>
    /// Получить средний рейтинг порта.
    /// </summary>
    public async Task<AverageRatingDto> GetAverageRatingForPortAsync(Guid portId)
    {
        var (average, count) = await _repo.GetAverageRatingForPortAsync(portId);
        return new AverageRatingDto(average, count);
    }

    /// <summary>
    /// Создать новый отзыв.
    /// </summary>
    public async Task<ReviewDto?> CreateAsync(CreateReviewDto dto, Guid authorId)
    {
        // Валидация: должна быть указана хотя бы одна целевая сущность
        if (!dto.UserId.HasValue && !dto.ShipId.HasValue && !dto.PortId.HasValue)
            return null;

        // Валидация: только одна целевая сущность
        var targetsCount = (dto.UserId.HasValue ? 1 : 0) + (dto.ShipId.HasValue ? 1 : 0) + (dto.PortId.HasValue ? 1 : 0);
        if (targetsCount > 1)
            return null;

        // Проверка существования автора
        var author = await _userRepo.GetByIdAsync(authorId);
        if (author is null)
            return null;

        // Для отзывов на партнеров и суда: проверка завершенного заказа
        if ((dto.UserId.HasValue || dto.ShipId.HasValue) && !dto.RentOrderId.HasValue)
            return null;

        if (dto.RentOrderId.HasValue)
        {
            var order = await _rentOrderRepo.GetByIdAsync(dto.RentOrderId.Value);

            if (order is null)
                return null;

            // Проверка, что заказ завершен или отменен
            if (order.Status != RentOrderStatus.Completed && order.Status != RentOrderStatus.Cancelled)
                return null;

            // Проверка, что пользователь участвовал в заказе
            if (order.UserId != authorId && order.PartnerId != authorId)
                return null;

            // Проверка соответствия целевой сущности и заказа
            if (dto.UserId.HasValue && order.PartnerId != dto.UserId.Value)
                return null;

            if (dto.ShipId.HasValue && order.ShipId != dto.ShipId.Value)
                return null;
        }

        // Проверка существования целевой сущности
        if (dto.UserId.HasValue)
        {
            var targetUser = await _userRepo.GetByIdAsync(dto.UserId.Value);
            if (targetUser is null || targetUser.Role != "partner")
                return null;
        }

        if (dto.ShipId.HasValue)
        {
            var ship = await _shipRepo.GetByIdAsync(dto.ShipId.Value);
            if (ship is null)
                return null;
        }

        if (dto.PortId.HasValue)
        {
            var port = await _portRepo.GetByIdAsync(dto.PortId.Value);
            if (port is null)
                return null;
        }

        var entity = new Review
        {
            Id = Guid.NewGuid(),
            AuthorId = authorId,
            Author = author,
            UserId = dto.UserId,
            ShipId = dto.ShipId,
            PortId = dto.PortId,
            RentOrderId = dto.RentOrderId,
            Comment = dto.Comment,
            Rating = dto.Rating,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null,
            IsActive = true
        };

        var created = await _repo.CreateAsync(entity);

        // Перезагружаем с навигационными свойствами
        var result = await _repo.GetByIdAsync(created.Id);

        return result is not null ? _mapper.Map<ReviewDto>(result) : null;
    }

    /// <summary>
    /// Обновить существующий отзыв.
    /// </summary>
    public async Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto, Guid authorId)
    {
        var entity = await _repo.GetByIdAsync(id);

        if (entity is null)
            return null;

        // Проверка прав: только автор может редактировать свой отзыв (или администратор для IsActive)
        if (entity.AuthorId != authorId && dto.Comment != null && dto.Rating.HasValue)
            return null;

        if (!string.IsNullOrWhiteSpace(dto.Comment))
            entity.Comment = dto.Comment;

        if (dto.Rating.HasValue)
            entity.Rating = dto.Rating.Value;

        if (dto.IsActive.HasValue)
            entity.IsActive = dto.IsActive.Value;

        if (dto.Comment != null || dto.Rating.HasValue)
            entity.UpdatedAt = DateTime.UtcNow;

        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? _mapper.Map<ReviewDto>(entity) : null;
    }

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);
}
