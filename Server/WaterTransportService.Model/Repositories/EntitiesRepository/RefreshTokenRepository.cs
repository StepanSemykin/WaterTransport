using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class RefreshTokenRepository(WaterTransportDbContext context) : IEntityRepository<RefreshToken, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<RefreshToken> CreateAsync(RefreshToken entity)
    {
        _context.RefreshTokens.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<RefreshToken>> GetAllAsync() => await _context.RefreshTokens.ToListAsync();

    public async Task<RefreshToken?> GetByIdAsync(Guid id) => await _context.RefreshTokens.FindAsync(id);

    public async Task<bool> UpdateAsync(RefreshToken entity, Guid id)
    {
        var old = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RefreshTokens.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
