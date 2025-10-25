using Microsoft.EntityFrameworkCore;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Repositories;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;


namespace WaterTransportService.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly WaterTransportDbContext _db;
    public UserRepository(WaterTransportDbContext db) => _db = db;

    public Task<List<User>> GetAllAsync(int skip, int take, CancellationToken ct) =>
        _db.Users
           .AsNoTracking()
           .OrderBy(u => u.CreatedAt)
           .Skip(skip).Take(take)
           .ToListAsync(ct);

    public Task<int> CountAsync(CancellationToken ct) =>
        _db.Users.CountAsync(ct);

    public Task<User?> GetByIdAsync(Guid id, CancellationToken ct) =>
        _db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public async Task AddAsync(User user, CancellationToken ct)
    {
        await _db.Users.AddAsync(user, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(User user, CancellationToken ct)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(User user, CancellationToken ct)
    {
        _db.Users.Remove(user);
        await _db.SaveChangesAsync(ct);
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken ct) =>
        _db.Users.AnyAsync(u => u.Id == id, ct);
}