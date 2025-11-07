using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// –епозиторий дл€ работы с заказами регул€рных рейсов.
/// </summary>
public class RegularOrderRepository(WaterTransportDbContext context) : IEntityRepository<RegularOrder, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// ѕолучить все заказы регул€рных рейсов.
    /// </summary>
    public async Task<IEnumerable<RegularOrder>> GetAllAsync() => await _context.RegularOrders.ToListAsync();

    /// <summary>
    /// ѕолучить заказ регул€рных рейсов по идентификатору.
    /// </summary>
    public async Task<RegularOrder?> GetByIdAsync(Guid id) => await _context.RegularOrders.FindAsync(id);

    /// <summary>
    /// —оздать новый заказ регул€рных рейсов.
    /// </summary>
    public async Task<RegularOrder> CreateAsync(RegularOrder entity)
    {
        _context.RegularOrders.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// ќбновить заказ регул€рных рейсов.
    /// </summary>
    public async Task<bool> UpdateAsync(RegularOrder entity, Guid id)
    {
        var old = await _context.RegularOrders.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// ”далить заказ регул€рных рейсов.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RegularOrders.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
