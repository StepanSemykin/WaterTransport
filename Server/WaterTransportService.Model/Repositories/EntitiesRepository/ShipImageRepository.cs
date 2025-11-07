using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с изображениями кораблей.
/// </summary>
public class ShipImageRepository(WaterTransportDbContext context) : IEntityRepository<ShipImage, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все изображения кораблей.
    /// </summary>
    /// <returns>Коллекция изображений кораблей.</returns>
    public async Task<IEnumerable<ShipImage>> GetAllAsync() => await _context.ShipImages.ToListAsync();

    /// <summary>
    /// Получить изображение корабля по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>Изображение корабля или null, если не найдено.</returns>
    public async Task<ShipImage?> GetByIdAsync(Guid id) => await _context.ShipImages.FindAsync(id);

    /// <summary>
    /// Создать новое изображение корабля.
    /// </summary>
    /// <param name="entity">Сущность изображения для создания.</param>
    /// <returns>Созданная сущность изображения.</returns>
    public async Task<ShipImage> CreateAsync(ShipImage entity)
    {
        _context.ShipImages.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить изображение корабля.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого изображения.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(ShipImage entity, Guid id)
    {
        var old = await _context.ShipImages.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        old.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить изображение корабля.
    /// </summary>
    /// <param name="id">Идентификатор изображения для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.ShipImages.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
