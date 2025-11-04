using Microsoft.AspNetCore.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Auth;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

public class UserService(
    IUserRepository<Guid> userRepo,
    IEntityRepository<OldPassword, Guid> oldPasswordRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IUserService
{
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<OldPassword, Guid> _oldPasswordRepo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly ITokenService _tokenService = tokenService;

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

    public async Task<LoginResponseDto?> RegisterAsync(RegisterDto dto)
    {
        // Проверка существования пользователя
        var existingUser = await _userRepo.GetByPhoneAsync(dto.Phone);
        if (existingUser != null)
        {
            return null;
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Phone = dto.Phone,
            Role = "common",
            IsActive = true,
            Hash = _passwordHasher.Generate(dto.Password)
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

        // Генерация токенов
        var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, MapToDto(user));
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        if (user.LockedUntil.HasValue && user.LockedUntil.Value > DateTime.UtcNow)
        {
            return null;
        }

        var isValidPassword = _passwordHasher.Verify(dto.Password, user.Hash);

        if (!isValidPassword)
        {
            user.FailedLoginAttempts = (user.FailedLoginAttempts ?? 0) + 1;

            if (user.FailedLoginAttempts >= 5)
            {
                user.LockedUntil = DateTime.UtcNow.AddMinutes(15);
            }

            await _userRepo.UpdateAsync(user, user.Id);
            return null;
        }

        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepo.UpdateAsync(user, user.Id);

        var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, MapToDto(user));
    }

    public async Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        var validToken = await _tokenService.ValidateRefreshTokenAsync(userId, refreshToken);
        if (validToken is null)
        {
            return null;
        }

        // Генерация новых токенов
        var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(user.Id, newRefreshToken, refreshTokenExpiry);

        return new RefreshTokenResponseDto(accessToken, newRefreshToken);
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        await _tokenService.RevokeRefreshTokenAsync(userId);
        return true;
    }

    [Authorize(Roles = "admin")]
    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Phone = dto.Phone,
            CreatedAt = DateTime.UtcNow,
            LastLoginAt = null,
            IsActive = dto.IsActive,
            FailedLoginAttempts = 0,
            LockedUntil = null,
            Role = dto.Role ?? "common",
            Hash = _passwordHasher.Generate(dto.Password)
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
                Hash = user.Hash,
                CreatedAt = DateTime.UtcNow
            };
            await _oldPasswordRepo.CreateAsync(oldPwd);

            user.Hash = _passwordHasher.Generate(dto.NewPassword);
        }

        var ok = await _userRepo.UpdateAsync(user, id);
        return ok ? MapToDto(user) : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        //delete refresh token
        await _tokenService.RevokeRefreshTokenAsync(id);
        return await _userRepo.DeleteAsync(id);
    }

    private static UserDto MapToDto(User u) =>
        new(u.Id, u.Phone, u.CreatedAt, u.LastLoginAt,
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Role);
}
