using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public class UserRepository(WaterTransportDbContext context) : IUserRepository<Guid>
{
    private readonly WaterTransportDbContext _context = context;

    public async Task<IEnumerable<User>> GetAllAsync() => await _context.Users.ToListAsync();

    public async Task<User?> GetByIdAsync(Guid id) => await _context.Users.FindAsync(id);

    public async Task<User?> GetByPhoneAsync(string phone)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == phone);

        return user;
    }

    public async Task<bool> UpdateAsync(User entity, Guid id)
    {
        var old = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        old.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<User> CreateAsync(User entity)
    {
        _context.Users.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.Users.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
