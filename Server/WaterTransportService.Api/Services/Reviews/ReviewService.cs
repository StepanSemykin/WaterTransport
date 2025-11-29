using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Constants;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Reviews;

/// <summary>
/// Сервис для работы с отзывами.
/// </summary>
public class ReviewService(
    IEntityRepository<Review, Guid> repo,
    IUserRepository<Guid> userRepo,
    IEntityRepository<Ship, Guid> shipRepo,
    IPortRepository<Guid> portRepo,
    WaterTransportDbContext context,
    IMapper mapper) : IReviewService
{
    private readonly IEntityRepository<Review, Guid> _repo = repo;
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<Ship, Guid> _shipRepo = shipRepo;
    private readonly IPortRepository<Guid> _portRepo = portRepo;
    private readonly WaterTransportDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех отзывов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<ReviewDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        
        var all = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .Where(r => r.IsActive)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
        
        var total = all.Count;
        var items = all
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(MapToDto)
            .ToList();
        
        return (items, total);
    }

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    public async Task<ReviewDto?> GetByIdAsync(Guid id)
    {
        var review = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .FirstOrDefaultAsync(r => r.Id == id);
        
        return review is null ? null : MapToDto(review);
    }

    /// <summary>
    /// Получить все отзывы о конкретном пользователе-партнере.
    /// </summary>
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByUserIdAsync(Guid userId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .Where(r => r.UserId == userId && r.IsActive)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        
        return reviews.Select(MapToDto).ToList();
    }

    /// <summary>
    /// Получить все отзывы о конкретном судне.
    /// </summary>
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByShipIdAsync(Guid shipId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .Where(r => r.ShipId == shipId && r.IsActive)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        
        return reviews.Select(MapToDto).ToList();
    }

    /// <summary>
    /// Получить все отзывы о конкретном порте.
    /// </summary>
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByPortIdAsync(Guid portId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .Where(r => r.PortId == portId && r.IsActive)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        
        return reviews.Select(MapToDto).ToList();
    }

    /// <summary>
    /// Получить средний рейтинг пользователя-партнеры.
    /// </summary>
    public async Task<AverageRatingDto> GetAverageRatingForUserAsync(Guid userId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.UserId == userId && r.IsActive)
            .ToListAsync();
        
        if (!reviews.Any())
            return new AverageRatingDto(0, 0);
        
        var average = reviews.Average(r => r.Rating);
        return new AverageRatingDto(Math.Round(average, 2), reviews.Count);
    }

    /// <summary>
    /// Получить средний рейтинг судна.
    /// </summary>
    public async Task<AverageRatingDto> GetAverageRatingForShipAsync(Guid shipId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ShipId == shipId && r.IsActive)
            .ToListAsync();
        
        if (!reviews.Any())
            return new AverageRatingDto(0, 0);
        
        var average = reviews.Average(r => r.Rating);
        return new AverageRatingDto(Math.Round(average, 2), reviews.Count);
    }

    /// <summary>
    /// Получить средний рейтинг порта.
    /// </summary>
    public async Task<AverageRatingDto> GetAverageRatingForPortAsync(Guid portId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.PortId == portId && r.IsActive)
            .ToListAsync();
        
        if (!reviews.Any())
            return new AverageRatingDto(0, 0);
        
        var average = reviews.Average(r => r.Rating);
        return new AverageRatingDto(Math.Round(average, 2), reviews.Count);
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
            var order = await _context.RentOrders
                .FirstOrDefaultAsync(ro => ro.Id == dto.RentOrderId.Value);

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
        var result = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .FirstOrDefaultAsync(r => r.Id == created.Id);

        return result is not null ? MapToDto(result) : null;
    }

    /// <summary>
    /// Обновить существующий отзыв.
    /// </summary>
    public async Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto, Guid authorId)
    {
        var entity = await _context.Reviews
            .Include(r => r.Author)
            .ThenInclude(a => a.UserProfile)
            .FirstOrDefaultAsync(r => r.Id == id);
        
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
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность отзыва в DTO.
    /// </summary>
    private static ReviewDto MapToDto(Review e)
    {
        var authorName = e.Author?.UserProfile?.Nickname 
            ?? $"{e.Author?.UserProfile?.FirstName} {e.Author?.UserProfile?.LastName}".Trim()
            ?? e.Author?.Phone 
            ?? "Аноним";

        return new ReviewDto(
            e.Id,
            e.AuthorId,
            authorName,
            e.UserId,
            e.ShipId,
            e.PortId,
            e.RentOrderId,
            e.Comment,
            e.Rating,
            e.CreatedAt,
            e.UpdatedAt,
            e.IsActive
        );
    }
}
