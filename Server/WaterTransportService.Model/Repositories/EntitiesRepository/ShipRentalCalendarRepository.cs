using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с календарём аренды судов.
/// </summary>
public class ShipRentalCalendarRepository(WaterTransportDbContext context) : IEntityRepository<ShipRentalCalendar, Guid>
{
    private static readonly DateTime InfiniteUtc = DateTime.SpecifyKind(DateTime.MaxValue, DateTimeKind.Utc);
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<ShipRentalCalendar>> GetAllAsync() =>
        await _context.ShipRentalCalendars.ToListAsync();

    public async Task<ShipRentalCalendar?> GetByIdAsync(Guid id) =>
        await _context.ShipRentalCalendars.FindAsync(id);

    public async Task<ShipRentalCalendar?> GetByRentOrderIdAsync(Guid rentOrderId) =>
        await _context.ShipRentalCalendars.FirstOrDefaultAsync(x => x.RentOrderId == rentOrderId);

    public async Task<ShipRentalCalendar> CreateAsync(ShipRentalCalendar entity)
    {
        _context.ShipRentalCalendars.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(ShipRentalCalendar entity, Guid id)
    {
        var existing = await _context.ShipRentalCalendars.FirstOrDefaultAsync(x => x.Id == id);
        if (existing is null) return false;

        _context.Entry(existing).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await GetByIdAsync(id);
        if (existing is null) return false;

        _context.ShipRentalCalendars.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить запись по идентификатору заказа.
    /// </summary>
    public async Task<bool> DeleteByRentOrderIdAsync(Guid rentOrderId)
    {
        var entry = await GetByRentOrderIdAsync(rentOrderId);
        if (entry is null) return false;
        _context.ShipRentalCalendars.Remove(entry);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Проверить, занято ли судно в указанный интервал.
    /// </summary>
    public async Task<bool> HasOverlapAsync(Guid shipId, DateTime start, DateTime? end, Guid? excludeEntryId = null)
    {
        var normalizedEnd = end ?? InfiniteUtc;
        var query = _context.ShipRentalCalendars.AsQueryable().Where(x => x.ShipId == shipId);
        if (excludeEntryId.HasValue)
        {
            query = query.Where(x => x.Id != excludeEntryId.Value);
        }

        return await query.AnyAsync(entry =>
            entry.StartTime < normalizedEnd &&
            (entry.EndTime ?? InfiniteUtc) > start);
    }
}
