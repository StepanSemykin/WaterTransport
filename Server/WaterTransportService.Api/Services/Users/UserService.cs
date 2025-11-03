using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

public class UserService(
    IUserRepository<Guid> userRepo,
    IEntityRepository<OldPassword, Guid> oldPasswordRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IPasswordHasher passwordHasher,
    IConfiguration configuration
) : IUserService
{
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<OldPassword, Guid> _oldPasswordRepo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IConfiguration _config = configuration;

    public async Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize)
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

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        if (user is null) return "non user and non token";
        var result = VerifyPassword(dto.Password, user.Salt, user.Hash);

        if (result is false || user.Phone is null)
        {
            return "non user and non token";
        }

        var token = GenerateToken(user.Phone, user.Role ?? string.Empty);
        return token;
    }

    private string GenerateToken(string phone, string role)
    {
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];
        var keyStr = _config["Jwt:Key"] ?? string.Empty;
        var expMinutes = _config.GetValue<int?>("Jwt:ExpirationMinutes") ?? 60;

        Claim[] claims = [new("phone", phone), new("role", role)];

        SymmetricSecurityKey key;
        try
        {
            var keyBytes = Convert.FromBase64String(keyStr);
            key = new SymmetricSecurityKey(keyBytes);
        }
        catch
        {
            key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(keyStr));
        }

        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expMinutes),
            signingCredentials: signingCredentials
        );

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var (salt, hash) = HashPassword(dto.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Phone = dto.Phone,
            CreatedAt = DateTime.UtcNow,
            LastLoginAt = null,
            IsActive = dto.IsActive,
            FailedLoginAttempts = 0,
            LockedUntil = null,
            Role = "common",
            Salt = salt,
            Hash = hash
        };

        await _userRepo.CreateAsync(user);

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

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.Role is not null) user.Role = dto.Role;

        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
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

            var (salt, hash) = HashPassword(dto.NewPassword);
            user.Salt = salt;
            user.Hash = hash;
        }

        var ok = await _userRepo.UpdateAsync(user, id);
        return ok ? MapToDto(user) : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _userRepo.DeleteAsync(id);
    }

    private static UserDto MapToDto(User u) =>
        new(u.Id, u.Phone, u.CreatedAt, u.LastLoginAt,
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Role);

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
    private static bool VerifyPassword(string password, string salt, string hash)
    {
        const int keySize = 32;
        const int iterations = 100_000;

        if (string.IsNullOrEmpty(salt) || string.IsNullOrEmpty(hash))
            return false;

        var saltBytes = Convert.FromBase64String(salt);
        var expectedHashBytes = Convert.FromBase64String(hash);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, iterations, HashAlgorithmName.SHA256);
        var computedKey = pbkdf2.GetBytes(keySize);

        return CryptographicOperations.FixedTimeEquals(computedKey, expectedHashBytes);
    }
}
