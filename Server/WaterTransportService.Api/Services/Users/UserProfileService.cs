using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

public class UserProfileService(IEntityRepository<UserProfile, Guid> repo) : IUserProfileService
{
    private readonly IEntityRepository<UserProfile, Guid> _repo = repo;

    public async Task<(IReadOnlyList<UserProfileDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.UserId).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<UserProfileDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<UserProfileDto?> CreateAsync(CreateUserProfileDto dto)
    {
        // метод не нужен, т.к. профиль создается вместе с пользователем
        await Task.CompletedTask;
        return null;
    }

    public async Task<UserProfileDto?> UpdateAsync(Guid id, UpdateUserProfileDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Nickname)) entity.Nickname = dto.Nickname;
        if (!string.IsNullOrWhiteSpace(dto.FirstName)) entity.FirstName = dto.FirstName;
        if (!string.IsNullOrWhiteSpace(dto.LastName)) entity.LastName = dto.LastName;
        if (!string.IsNullOrWhiteSpace(dto.Patronymic)) entity.Patronymic = dto.Patronymic;
        if (!string.IsNullOrWhiteSpace(dto.Email)) entity.Email = dto.Email;
        if (dto.Birthday.HasValue) entity.Birthday = dto.Birthday.Value;
        if (!string.IsNullOrWhiteSpace(dto.About)) entity.About = dto.About;
        if (!string.IsNullOrWhiteSpace(dto.Location)) entity.Location = dto.Location;
        if (dto.IsPublic.HasValue) entity.IsPublic = dto.IsPublic.Value;
        entity.UpdatedAt = DateTime.UtcNow;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    private static UserProfileDto MapToDto(UserProfile e) => new(e.UserId, e.Nickname, e.FirstName, e.LastName, e.Patronymic, e.Email, e.Birthday, e.About, e.Location, e.IsPublic, e.UpdatedAt);
}
