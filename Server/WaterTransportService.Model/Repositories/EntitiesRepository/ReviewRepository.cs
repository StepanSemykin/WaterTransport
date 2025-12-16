using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с отзывами.
/// </summary>
public class ReviewRepository(WaterTransportDbContext context) : IReviewRepository
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все отзывы.
    /// </summary>
    /// <returns>Коллекция отзывов.</returns>
    public async Task<IEnumerable<Review>> GetAllAsync() => await _context.Reviews
        .Include(r => r.Author)
        .ThenInclude(a => a.UserProfile)
        .ToListAsync();

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор отзыва.</param>
    /// <returns>Отзыв или null, если не найден.</returns>
    public async Task<Review?> GetByIdAsync(Guid id) => await _context.Reviews
        .Include(r => r.Author)
        .ThenInclude(a => a.UserProfile)
        .FirstOrDefaultAsync(r => r.Id == id);

    /// <summary>
    /// Получить все активные отзывы с пагинацией.
    /// </summary>
    /// <param name="skip">Количество записей для пропуска.</param>
    /// <param name="take">Количество записей для получения.</param>
    /// <returns>Коллекция активных отзывов.</returns>
    public async Task<IEnumerable<Review>> GetAllActiveAsync(int skip, int take) => await _context.Reviews
        .Include(r => r.Author)
        .ThenInclude(a => a.UserProfile)
        .Where(r => r.IsActive)
        .OrderByDescending(x => x.CreatedAt)
        .Skip(skip)
        .Take(take)
        .ToListAsync();

    /// <summary>
    /// Получить количество активных отзывов.
    /// </summary>
    /// <returns>Количество активных отзывов.</returns>
    public async Task<int> GetActiveCountAsync() => await _context.Reviews
        .Where(r => r.IsActive)
        .CountAsync();

    /// <summary>
    /// Получить все отзывы о пользователе-партнере.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Коллекция отзывов о пользователе.</returns>
    public async Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId) => await _context.Reviews
        .Include(r => r.Author)
        .ThenInclude(a => a.UserProfile)
        .Where(r => r.UserId == userId && r.IsActive)
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync();

    /// <summary>
    /// Получить все отзывы о судне.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Коллекция отзывов о судне.</returns>
    public async Task<IEnumerable<Review>> GetReviewsByShipIdAsync(Guid shipId) => await _context.Reviews
        .Include(r => r.Author)
        .ThenInclude(a => a.UserProfile)
        .Where(r => r.ShipId == shipId && r.IsActive)
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync();

    /// <summary>
    /// Получить все отзывы о порте.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Коллекция отзывов о порте.</returns>
    public async Task<IEnumerable<Review>> GetReviewsByPortIdAsync(Guid portId) => await _context.Reviews
        .Include(r => r.Author)
        .ThenInclude(a => a.UserProfile)
        .Where(r => r.PortId == portId && r.IsActive)
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync();

    /// <summary>
    /// Получить средний рейтинг пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    public async Task<(float Average, int Count)> GetAverageRatingForUserAsync(Guid userId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.UserId == userId && r.IsActive)
            .ToListAsync();

        if (reviews.Count == 0)
            return (0, 0);

        var average = reviews.Average(r => r.Rating);
        return ((float)Math.Round(average, 2), reviews.Count);
    }

    /// <summary>
    /// Получить средний рейтинг судна.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    public async Task<(float Average, int Count)> GetAverageRatingForShipAsync(Guid shipId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ShipId == shipId && r.IsActive)
            .ToListAsync();

        if (reviews.Count == 0)
            return (0, 0);

        var average = reviews.Average(r => r.Rating);
        return ((float)Math.Round(average, 2), reviews.Count);
    }

    /// <summary>
    /// Получить средний рейтинг порта.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    public async Task<(float Average, int Count)> GetAverageRatingForPortAsync(Guid portId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.PortId == portId && r.IsActive)
            .ToListAsync();

        if (reviews.Count == 0)
            return (0, 0);

        var average = reviews.Average(r => r.Rating);
        return ((float)Math.Round(average, 2), reviews.Count);
    }

    /// <summary>
    /// Создать новый отзыв.
    /// </summary>
    /// <param name="entity">Сущность отзыва для создания.</param>
    /// <returns>Созданная сущность отзыва.</returns>
    public async Task<Review> CreateAsync(Review entity)
    {
        _context.Reviews.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить отзыв.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого отзыва.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(Review entity, Guid id)
    {
        var old = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    /// <param name="id">Идентификатор отзыва для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.Reviews.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
