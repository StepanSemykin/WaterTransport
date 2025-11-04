using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с изображениями портов.
/// </summary>
public class PortImageRepository(WaterTransportDbContext context) : IEntityRepository<PortImage, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все изображения портов.
    /// </summary>
    /// <returns>Коллекция изображений портов.</returns>
    public async Task<IEnumerable<PortImage>> GetAllAsync() => await _context.PortImages.ToListAsync();

    /// <summary>
    /// Получить изображение порта по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>Изображение порта или null, если не найдено.</returns>
    public async Task<PortImage?> GetByIdAsync(Guid id) => await _context.PortImages.FindAsync(id);

    /// <summary>
    /// Создать новое изображение порта.
    /// </summary>
    /// <param name="entity">Сущность изображения для создания.</param>
    /// <returns>Созданная сущность изображения.</returns>
    public async Task<PortImage> CreateAsync(PortImage entity)
    {
        _context.PortImages.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить изображение порта.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого изображения.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(PortImage entity, Guid id)
    {
        var old = await _context.PortImages.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        old.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить изображение порта.
    /// </summary>
    /// <param name="id">Идентификатор изображения для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.PortImages.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
