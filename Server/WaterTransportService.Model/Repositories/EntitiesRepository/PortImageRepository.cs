using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class PortImageRepository(WaterTransportDbContext context) : IEntityRepository<PortImage, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<PortImage> AddAsync(PortImage entity)
    {
        _context.PortImages.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<PortImage>> GetAllAsync() => await _context.PortImages.ToListAsync();

    public async Task<PortImage?> GetByIdAsync(Guid id) => await _context.PortImages.FindAsync(id);

    public async Task<bool> UpdateAsync(PortImage entity, Guid id)
    {
        var old = await _context.PortImages.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        old.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.PortImages.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
