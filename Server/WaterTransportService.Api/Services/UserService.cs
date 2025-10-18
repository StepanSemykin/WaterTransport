using System.Security.Cryptography;
using System.Text;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Repositories;
using WaterTransportService.Api.Services;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repo) => _repo = repo;

    public async Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

        var skip = (page - 1) * pageSize;
        var total = await _repo.CountAsync(ct);
        var items = await _repo.GetAllAsync(skip, pageSize, ct);

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        return user is null ? null : MapToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken ct)
    {
        var (salt, hash) = HashPassword(dto.Password);

        var user = new User
        {
            Uuid = Guid.NewGuid(),
            Phone = dto.Phone,
            Nickname = dto.Nickname,
            CreatedAt = DateTime.UtcNow,
            LastLoginAt = null,
            IsActive = dto.IsActive,
            FailedLoginAttempts = 0,
            LockedUntil = null,
            Roles = dto.Roles ?? Array.Empty<int>(),
            Salt = salt,
            Hash = hash
        };

        await _repo.AddAsync(user, ct);
        return MapToDto(user);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto, CancellationToken ct)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
        if (!string.IsNullOrWhiteSpace(dto.Nickname)) user.Nickname = dto.Nickname;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.Roles is not null) user.Roles = dto.Roles;

        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
            var (salt, hash) = HashPassword(dto.NewPassword);
            user.Salt = salt;
            user.Hash = hash;

            // история паролей, если нужна:
            user.OldPasswords.Add(new OldPassword
            {
                Id = Guid.NewGuid(),
                UserId = user.Uuid,
                Salt = salt,
                Hash = hash,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _repo.UpdateAsync(user, ct);
        return MapToDto(user);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return false;

        await _repo.DeleteAsync(user, ct);
        return true;
    }

    private static UserDto MapToDto(User u) =>
        new(u.Uuid, u.Phone, u.Nickname, u.CreatedAt, u.LastLoginAt,
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Roles);

    // PBKDF2-хэширование пароля (без внешних пакетов)
    private static (string Salt, string Hash) HashPassword(string password)
    {
        // параметры можно вынести в конфиг
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