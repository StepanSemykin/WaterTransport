using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class RegularOrderRepository(WaterTransportDbContext context) : IEntityRepository<RegularOrder, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<RegularOrder>> GetAllAsync() => await _context.RegularOrders.ToListAsync();

    public async Task<RegularOrder?> GetByIdAsync(Guid id) => await _context.RegularOrders.FindAsync(id);

    public async Task<RegularOrder> CreateAsync(RegularOrder entity)
    {
        _context.RegularOrders.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(RegularOrder entity, Guid id)
    {
        var old = await _context.RegularOrders.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RegularOrders.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
