using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// –епозиторий дл€ работы с календар€ми регул€рных рейсов.
/// </summary>
public class RegularCalendarRepository(WaterTransportDbContext context) : IEntityRepository<RegularCalendar, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// ѕолучить все календари регул€рных рейсов.
    /// </summary>
    public async Task<IEnumerable<RegularCalendar>> GetAllAsync() => await _context.RegularCalendars.ToListAsync();

    /// <summary>
    /// ѕолучить календарь регул€рных рейсов по идентификатору.
    /// </summary>
    public async Task<RegularCalendar?> GetByIdAsync(Guid id) => await _context.RegularCalendars.FindAsync(id);

    /// <summary>
    /// —оздать новый календарь регул€рных рейсов.
    /// </summary>
    public async Task<RegularCalendar> CreateAsync(RegularCalendar entity)
    {
        _context.RegularCalendars.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// ќбновить календарь регул€рных рейсов.
    /// </summary>
    public async Task<bool> UpdateAsync(RegularCalendar entity, Guid id)
    {
        var old = await _context.RegularCalendars.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// ”далить календарь регул€рных рейсов.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RegularCalendars.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
