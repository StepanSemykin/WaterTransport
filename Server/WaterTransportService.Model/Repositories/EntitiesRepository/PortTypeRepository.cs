using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class PortTypeRepository(WaterTransportDbContext context) : IEntityRepository<PortType, ushort>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<PortType>> GetAllAsync() => await _context.PortTypes.ToListAsync();

    public async Task<PortType?> GetByIdAsync(ushort id) => await _context.PortTypes.FindAsync(id);

    public async Task<PortType> CreateAsync(PortType entity)
    {
        _context.PortTypes.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(PortType entity, ushort id)
    {
        var old = await _context.PortTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(ushort id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.PortTypes.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
