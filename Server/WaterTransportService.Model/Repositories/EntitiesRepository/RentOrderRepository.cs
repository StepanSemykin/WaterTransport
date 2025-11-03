using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class RentOrderRepository(WaterTransportDbContext context) : IEntityRepository<RentOrder, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<RentOrder>> GetAllAsync() => await _context.RentOrders.ToListAsync();

    public async Task<RentOrder?> GetByIdAsync(Guid id) => await _context.RentOrders.FindAsync(id);

    public async Task<RentOrder> CreateAsync(RentOrder entity)
    {
        _context.RentOrders.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(RentOrder entity, Guid id)
    {
        var old = await _context.RentOrders.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RentOrders.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
