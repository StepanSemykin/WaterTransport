using System.Security.Cryptography;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

public class UserService(
    IEntityRepository<User, Guid> userRepo,
    IEntityRepository<OldPassword, Guid> oldPasswordRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo
) : IUserService
{
    private readonly IEntityRepository<User, Guid> _userRepo = userRepo;
    private readonly IEntityRepository<OldPassword, Guid> _oldPasswordRepo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;

    public async Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

        var all = (await _userRepo.GetAllAsync()).ToList();
        var ordered = all.OrderBy(u => u.CreatedAt).ToList();
        var total = ordered.Count;
        var skip = (page - 1) * pageSize;
        var items = ordered.Skip(skip).Take(pageSize).Select(MapToDto).ToList();

        return (items, total);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var user = await _userRepo.GetByIdAsync(id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken ct)
    {
        var (salt, hash) = HashPassword(dto.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Phone = dto.Phone,
            Nickname = dto.Nickname,
            CreatedAt = DateTime.UtcNow,
            LastLoginAt = null,
            IsActive = dto.IsActive,
            FailedLoginAttempts = 0,
            LockedUntil = null,
            Roles = dto.Roles ?? [],
            Salt = salt,
            Hash = hash
        };

        await _userRepo.CreateAsync(user);

        // Auto-create a default UserProfile for the new user
        var profile = new UserProfile
        {
            UserId = user.Id,
            User = user,
            FirstName = null,
            LastName = null,
            Patronymic = null,
            Email = null,
            Birthday = null,
            About = null,
            Location = null,
            IsPublic = true,
            UpdatedAt = DateTime.UtcNow
        };
        await _userProfileRepo.CreateAsync(profile);

        return MapToDto(user);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto, CancellationToken ct)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
        if (!string.IsNullOrWhiteSpace(dto.Nickname)) user.Nickname = dto.Nickname;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.Roles is not null) user.Roles = dto.Roles;

        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
            // Сохраняем прежний пароль в историю через репозиторий
            var oldPwd = new OldPassword
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                User = user,
                Salt = user.Salt,
                Hash = user.Hash,
                CreatedAt = DateTime.UtcNow
            };
            await _oldPasswordRepo.CreateAsync(oldPwd);

            // Применяем новый пароль пользователю
            var (salt, hash) = HashPassword(dto.NewPassword);
            user.Salt = salt;
            user.Hash = hash;
        }

        var ok = await _userRepo.UpdateAsync(user, id);
        return ok ? MapToDto(user) : null;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        return await _userRepo.DeleteAsync(id);
    }

    private static UserDto MapToDto(User u) =>
        new(u.Id, u.Phone, u.Nickname, u.CreatedAt, u.LastLoginAt,
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Roles);

    // PBKDF2-хэширование пароля (без внешних пакетов)
    private static (string Salt, string Hash) HashPassword(string password)
    {
        const int saltSize = 16;
        const int keySize = 32;
        const int iterations = 100_000;

        using var rng = RandomNumberGenerator.Create();
        var saltBytes = new byte[saltSize];
        rng.GetBytes(saltBytes);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, iterations, HashAlgorithmName.SHA256);
        var key = pbkdf2.GetBytes(keySize);

        var salt = Convert.ToBase64String(saltBytes);
        var hash = Convert.ToBase64String(key);
        return (salt, hash);
    }
}
