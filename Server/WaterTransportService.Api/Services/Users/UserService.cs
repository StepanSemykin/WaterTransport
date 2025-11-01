using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

public class UserService(
    IUserRepository<Guid> _userRepo,    
    IEntityRepository<OldPassword, Guid> oldPasswordRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IPasswordHasher passwordHasher
) : IUserService
{
    const string KEY = "mysupersecret_secretsecretsecretkey!123";
    private readonly IUserRepository<Guid> _userRepo = _userRepo;
    private readonly IEntityRepository<OldPassword, Guid> _oldPasswordRepo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher passwordHasher = passwordHasher;
   
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

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        if (user is null) { return "non user and non token"; }
        var result = VerifyPassword(dto.Password, user.Salt, user?.Hash ?? string.Empty);

        if (result ==  false)
        {
            // Here you would normally generate a JWT or similar token
            return "non user and non token";
        }
        
        var token = generateToken(user.Phone, user.Role);
        return token;
    }

    private string generateToken(string phone, string role)
    {
        Claim[] claims = [new("phone", phone), new("role", role)];
        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY)), SecurityAlgorithms.HmacSha256);
        string ISSUER = "MyAuthServer"; // �������� ������
        string AUDIENCE = "MyAuthClient"; // ����������� ������
        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: ISSUER,
            audience: AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: signingCredentials
        );

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
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
            Role = "common",
            Salt = salt,
            Hash = hash
        };

        await _userRepo.AddAsync(user);

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
        await _userProfileRepo.AddAsync(profile);

        return MapToDto(user);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto, CancellationToken ct)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
        if (!string.IsNullOrWhiteSpace(dto.Nickname)) user.Nickname = dto.Nickname;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.Role is not null) user.Role = dto.Role;

        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
            // ��������� ������� ������ � ������� ����� �����������
            var oldPwd = new OldPassword
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                User = user,
                Salt = user.Salt,
                Hash = user.Hash,
                CreatedAt = DateTime.UtcNow
            };
            await _oldPasswordRepo.AddAsync(oldPwd);

            // ��������� ����� ������ ������������
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
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Role);

    // PBKDF2-����������� ������ (��� ������� �������)
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

        // ���������� ���������, ����� �������� ������ �� �������
        return CryptographicOperations.FixedTimeEquals(computedKey, expectedHashBytes);
    }
}
