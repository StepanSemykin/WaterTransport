using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public interface IUserRepository<Id>
{
    public Task<IEnumerable<User>> GetAllAsync();
    public Task<User?> GetByIdAsync(Id id);
    public Task<User> CreateAsync(User user);
    public Task<bool> UpdateAsync(User user, Id id);
    public Task<bool> DeleteAsync(Id id);

    public Task<User?> GetByPhoneAsync(string phone);
}
