using Microsoft.AspNetCore.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Auth;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// ������ ���������� ��������������: CRUD, ��������������, ������ � ����������.
/// </summary>
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

    /// <summary>
    /// �������� ������ ������������� � ����������.
    /// </summary>
    /// <param name="page">����� �������� (������� 1).</param>
    /// <param name="pageSize">������ �������� (1-100).</param>
    /// <returns>������ �� ������� ������������� � ����� �����������.</returns>
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

    /// <summary>
    /// �������� ������������ �� ��������������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <returns>DTO ������������ ��� null, ���� �� ������.</returns>
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        return user is null ? null : MapToDto(user);
    }

    /// <summary>
    /// ������� ������������ (������ ��� ���� admin).
    /// </summary>
    /// <param name="dto">������ ��� �������� ������������.</param>
    /// <returns>��������� ������������.</returns>
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
            Nickname = null,
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

    /// <summary>
    /// �������� ������ ������������. ��� �������� ������ ��������� ��� � �������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <param name="dto">������ ��� ����������.</param>
    /// <returns>���������� ������������ ��� null, ���� �� ������.</returns>
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

    /// <summary>
    /// ������� ������������ � �������� ��� refresh �����.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <returns>True, ���� �������� ������ �������.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        await _tokenService.RevokeRefreshTokenAsync(id);
        return await _userRepo.DeleteAsync(id);
    }

    /// <summary>
    /// ����������� ������ ������������ � �������� access/refresh �������.
    /// </summary>
    /// <param name="dto">������ ��� �����������.</param>
    /// <returns>
    /// ����� ������� � ������ ������������ ��� null, ���� ������������ � ����� ��������� ��� ����������.
    /// </returns>
    public async Task<LoginResponseDto?> RegisterAsync(RegisterDto dto)
    {
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
            Nickname = null,
            UpdatedAt = DateTime.UtcNow
        };
        await _userProfileRepo.CreateAsync(profile);

        var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, MapToDto(user));
    }

    /// <summary>
    /// ���� ������������ �� �������� � ������. ����� ��������� ���������� � ������ ����� �������.
    /// </summary>
    /// <param name="dto">������ ��� �����.</param>
    /// <returns>����� ������� � ������ ������������ ��� null ��� ������ ��������������.</returns>
    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        // ������������ ����� ����������� ������ ���� �� ���������, �.�. ����� ����� 
        if (user is null || user.IsActive)
        {
            return new LoginResultDto(false, Failure: LoginFailureReason.NotFound);
        }
        else
        {
            if (!user.IsActive)
                return new LoginResultDto(false, Failure: LoginFailureReason.Inactive);

            if (user.LockedUntil is { } locked && locked > DateTime.UtcNow)
                return new LoginResultDto(false, Failure: LoginFailureReason.Locked, LockedUntil: locked);

            var isValidPassword = _passwordHasher.Verify(dto.Password, user.Hash);
            if (!isValidPassword)
            {
                user.FailedLoginAttempts = (user.FailedLoginAttempts ?? 0) + 1;
                if (user.FailedLoginAttempts >= 5)
                    user.LockedUntil = DateTime.UtcNow.AddMinutes(15);

                await _userRepo.UpdateAsync(user, user.Id);

                var remaining = Math.Max(0, 5 - (user.FailedLoginAttempts ?? 0));
                return user.LockedUntil.HasValue
                    ? new LoginResultDto(false, Failure: LoginFailureReason.Locked, LockedUntil: user.LockedUntil)
                    : new LoginResultDto(false, Failure: LoginFailureReason.InvalidPassword, RemainingAttempts: remaining);
            }

        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        user.IsActive = true;
        await _userRepo.UpdateAsync(user, user.Id);

            var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, MapToDto(user));
    }

    /// <summary>
    /// �������� access/refresh ������ ��� ������� ��������� refresh ������.
    /// </summary>
    /// <param name="userId">������������� ������������.</param>
    /// <param name="refreshToken">����������� refresh �����.</param>
    /// <returns>����� ����� ������� ��� null ��� ���������� ������/������������.</returns>
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

        var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(user.Id, newRefreshToken, refreshTokenExpiry);

        return new RefreshTokenResponseDto(accessToken, newRefreshToken);
    }

    /// <summary>
    /// ����� ������������: ����� refresh ������.
    /// </summary>
    /// <param name="userId">������������� ������������.</param>
    /// <returns>������ true ����� ��������� ������.</returns>
    public async Task<bool> LogoutAsync(Guid userId)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user is null) return false;
        user.IsActive = false;
        await _userRepo.UpdateAsync(user, userId);
        await _tokenService.RevokeRefreshTokenAsync(userId);
        return true;
    }

    /// <summary>
    /// ������������� �������� ������������ � DTO.
    /// </summary>
    private static UserDto MapToDto(User u) =>
        new(u.Id, u.Phone, u.CreatedAt, u.LastLoginAt,
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Role);
}
