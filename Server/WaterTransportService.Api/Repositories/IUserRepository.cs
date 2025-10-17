using WaterTransportService.Model.Entities;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Context;
using Microsoft.EntityFrameworkCore;

namespace WaterTransportService.Api.Repositories;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync(int skip, int take, CancellationToken ct);
    Task<int> CountAsync(CancellationToken ct);
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct);
    Task AddAsync(User user, CancellationToken ct);
    Task UpdateAsync(User user, CancellationToken ct);
    Task DeleteAsync(User user, CancellationToken ct);
    Task<bool> ExistsAsync(Guid id, CancellationToken ct);
}