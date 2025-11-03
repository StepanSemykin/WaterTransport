using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class ShipRepository(WaterTransportDbContext context) : IEntityRepository<Ship, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<Ship>> GetAllAsync() => await _context.Ships.ToListAsync();

    public async Task<Ship?> GetByIdAsync(Guid id) => await _context.Ships.FindAsync(id);

    public async Task<Ship> CreateAsync(Ship entity)
    {
        _context.Ships.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(Ship entity, Guid id)
    {
        var old = await _context.Ships.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.Ships.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
