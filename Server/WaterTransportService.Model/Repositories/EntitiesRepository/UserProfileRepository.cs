using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class UserProfileRepository(WaterTransportDbContext context) : IEntityRepository<UserProfile, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<UserProfile>> GetAllAsync() => await _context.UserProfiles.ToListAsync();

    public async Task<UserProfile?> GetByIdAsync(Guid id) => await _context.UserProfiles.FindAsync(id);

    public async Task<UserProfile> CreateAsync(UserProfile entity)
    {
        _context.UserProfiles.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(UserProfile entity, Guid id)
    {
        var old = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == id);
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
        _context.UserProfiles.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
