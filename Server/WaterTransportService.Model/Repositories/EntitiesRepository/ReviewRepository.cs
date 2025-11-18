using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с отзывами.
/// </summary>
public class ReviewRepository(WaterTransportDbContext context) : IEntityRepository<Review, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все отзывы.
    /// </summary>
    /// <returns>Коллекция отзывов.</returns>
    public async Task<IEnumerable<Review>> GetAllAsync() => await _context.Reviews.ToListAsync();

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор отзыва.</param>
    /// <returns>Отзыв или null, если не найден.</returns>
    public async Task<Review?> GetByIdAsync(Guid id) => await _context.Reviews.FindAsync(id);

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
