using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class ShipImageRepository(WaterTransportDbContext context) : IEntityRepository<ShipImage, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<ShipImage> AddAsync(ShipImage entity)
    {
        _context.ShipImages.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<ShipImage>> GetAllAsync() => await _context.ShipImages.ToListAsync();

    public async Task<ShipImage?> GetByIdAsync(Guid id) => await _context.ShipImages.FindAsync(id);

    public async Task<bool> UpdateAsync(ShipImage entity, Guid id)
    {
        var old = await _context.ShipImages.FirstOrDefaultAsync(x => x.Id == id);
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
        _context.ShipImages.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
