using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class OldPasswordRepository(WaterTransportDbContext context) : IEntityRepository<OldPassword, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<OldPassword>> GetAllAsync() => await _context.OldPasswords.ToListAsync();

    public async Task<OldPassword?> GetByIdAsync(Guid id) => await _context.OldPasswords.FindAsync(id);

    public async Task<OldPassword> CreateAsync(OldPassword entity)
    {
        _context.OldPasswords.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(OldPassword entity, Guid id)
    {
        var old = await _context.OldPasswords.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.OldPasswords.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
