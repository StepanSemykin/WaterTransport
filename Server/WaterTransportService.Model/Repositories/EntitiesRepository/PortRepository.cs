using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class PortRepository(WaterTransportDbContext context) : IEntityRepository<Port, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<Port>> GetAllAsync() => await _context.Ports.ToListAsync();

    public async Task<Port?> GetByIdAsync(Guid id) => await _context.Ports.FindAsync(id);

    public async Task<Port> CreateAsync(Port entity)
    {
        _context.Ports.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(Port entity, Guid id)
    {
        var old = await _context.Ports.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        old.Title = entity.Title;
        old.PortTypeId = entity.PortTypeId;
        old.PortType = entity.PortType;
        old.Latitude = entity.Latitude;
        old.Longitude = entity.Longitude;
        old.Address = entity.Address;
        old.Ships = entity.Ships;
        old.PortImages = entity.PortImages;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.Ports.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
