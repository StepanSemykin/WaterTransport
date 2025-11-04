using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с календарями аренды.
/// </summary>
public class RentCalendarRepository(WaterTransportDbContext context) : IEntityRepository<RentCalendar, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все календари аренды.
    /// </summary>
    /// <returns>Коллекция календарей аренды.</returns>
    public async Task<IEnumerable<RentCalendar>> GetAllAsync() => await _context.RentCalendars.ToListAsync();

    /// <summary>
    /// Получить календарь аренды по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор календаря аренды.</param>
    /// <returns>Календарь аренды или null, если не найден.</returns>
    public async Task<RentCalendar?> GetByIdAsync(Guid id) => await _context.RentCalendars.FindAsync(id);

    /// <summary>
    /// Создать новый календарь аренды.
    /// </summary>
    /// <param name="entity">Сущность календаря для создания.</param>
    /// <returns>Созданная сущность календаря.</returns>
    public async Task<RentCalendar> CreateAsync(RentCalendar entity)
    {
        _context.RentCalendars.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить календарь аренды.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого календаря.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(RentCalendar entity, Guid id)
    {
        var old = await _context.RentCalendars.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить календарь аренды.
    /// </summary>
    /// <param name="id">Идентификатор календаря для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RentCalendars.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
