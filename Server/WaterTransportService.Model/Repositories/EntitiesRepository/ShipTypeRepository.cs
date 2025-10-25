using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class ShipTypeRepository(WaterTransportDbContext context) : IEntityRepository<ShipType, ushort>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<ShipType> AddAsync(ShipType entity)
    {
        _context.ShipTypes.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<ShipType>> GetAllAsync() => await _context.ShipTypes.ToListAsync();

    public async Task<ShipType?> GetByIdAsync(ushort id) => await _context.ShipTypes.FindAsync(id);

    public async Task<bool> UpdateAsync(ShipType entity, ushort id)
    {
        var old = await _context.ShipTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(ushort id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.ShipTypes.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
