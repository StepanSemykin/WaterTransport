using AutoMapper;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Infrastructure.PasswordValidator;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Authentication.Services;

public class AuthService(
    IMapper mapper,
    IUserRepository<Guid> userRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IPasswordHasher passwordHasher,
    IPasswordValidator passwordValidator,
    ITokenService tokenService) : IAuthService
{
    private readonly IMapper _mapper = mapper;
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IPasswordValidator _passwordValidator = passwordValidator;
    private readonly ITokenService _tokenService = tokenService;

    public async Task<RegisterResultDto?> RegisterAsync(RegisterDto dto)
    {
        if (!_passwordValidator.IsPasswordValid(dto.Password))
        {
            return new RegisterResultDto(false, "Пароль не соответствует требованиям безопасности.");
        }

        var existingUser = await _userRepo.GetByPhoneAsync(dto.Phone);
        if (existingUser != null)
        {
            return new RegisterResultDto(false, "Пользователь с таким телефоном уже существует.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Phone = dto.Phone,
            Role = "common",
            IsActive = true,
            Hash = _passwordHasher.Generate(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        await _userRepo.CreateAsync(user);

        var profile = new UserProfile
        {
            UserId = user.Id,
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

        var userDto = _mapper.Map<UserDto>(user);

        return new RegisterResultDto(true, null, new LoginResponseDto(accessToken, refreshToken, userDto));
    }

    public async Task<LoginResultDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        if (user is null)
        {
            return new LoginResultDto(false, Failure: LoginFailureReason.NotFound);
        }

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

        var userDto = _mapper.Map<UserDto>(user);
        var payload = new LoginResponseDto(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            User: userDto
        );

        return new LoginResultDto(true, Data: payload);
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

        var accessToken = _tokenService.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(user.Id, newRefreshToken, refreshTokenExpiry);

        return new RefreshTokenResponseDto(accessToken, newRefreshToken);
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user is null) return false;
        user.IsActive = false;
        await _userRepo.UpdateAsync(user, userId);
        await _tokenService.RevokeRefreshTokenAsync(userId);
        return true;
    }
}
