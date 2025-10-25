using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class ReviewRepository(WaterTransportDbContext context) : IEntityRepository<Review, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<Review> AddAsync(Review entity)
    {
        _context.Reviews.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<Review>> GetAllAsync() => await _context.Reviews.ToListAsync();

    public async Task<Review?> GetByIdAsync(Guid id) => await _context.Reviews.FindAsync(id);

    public async Task<bool> UpdateAsync(Review entity, Guid id)
    {
        var old = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.Reviews.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
