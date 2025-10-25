using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class RentCalendarRepository(WaterTransportDbContext context) : IEntityRepository<RentCalendar, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<RentCalendar> AddAsync(RentCalendar entity)
    {
        _context.RentCalendars.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<RentCalendar>> GetAllAsync() => await _context.RentCalendars.ToListAsync();

    public async Task<RentCalendar?> GetByIdAsync(Guid id) => await _context.RentCalendars.FindAsync(id);

    public async Task<bool> UpdateAsync(RentCalendar entity, Guid id)
    {
        var old = await _context.RentCalendars.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RentCalendars.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
