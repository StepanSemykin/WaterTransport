using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Reviews;

/// <summary>
/// Сервис для работы с отзывами.
/// </summary>
public class ReviewService(IEntityRepository<Review, Guid> repo) : IReviewService
{
    private readonly IEntityRepository<Review, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех отзывов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<ReviewDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.CreatedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    public async Task<ReviewDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый отзыв.
    /// </summary>
    public async Task<ReviewDto?> CreateAsync(CreateReviewDto dto)
    {
        var entity = new Review
        {
            Id = Guid.NewGuid(),
            AuthorId = dto.AuthorId,
            Author = null!,
            UserId = dto.UserId,
            User = null,
            ShipId = dto.ShipId,
            Ship = null,
            Comment = dto.Comment,
            Rating = dto.Rating,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить существующий отзыв.
    /// </summary>
    public async Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.UserId.HasValue) entity.UserId = dto.UserId.Value;
        if (dto.ShipId.HasValue) entity.ShipId = dto.ShipId.Value;
        if (!string.IsNullOrWhiteSpace(dto.Comment)) entity.Comment = dto.Comment;
        if (dto.Rating.HasValue) entity.Rating = dto.Rating.Value;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
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
    private static ReviewDto MapToDto(Review e) => new(e.Id, e.AuthorId, e.UserId, e.ShipId, e.Comment, e.Rating, e.CreatedAt, e.IsActive);
}
