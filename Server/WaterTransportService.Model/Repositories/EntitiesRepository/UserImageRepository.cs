using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class UserImageRepository(WaterTransportDbContext context) : IEntityRepository<UserImage, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<UserImage>> GetAllAsync() => await _context.UserImages.ToListAsync();

    public async Task<UserImage?> GetByIdAsync(Guid id) => await _context.UserImages.FindAsync(id);

    public async Task<UserImage> CreateAsync(UserImage entity)
    {
        _context.UserImages.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(UserImage entity, Guid id)
    {
        var old = await _context.UserImages.FirstOrDefaultAsync(x => x.Id == id);
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
        _context.UserImages.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
