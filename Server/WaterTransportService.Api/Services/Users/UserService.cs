using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Auth;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Сервис управления пользователями.
/// </summary>
public class UserService(
    IMapper mapper,
    IUserRepository<Guid> userRepo,
    IEntityRepository<OldPassword, Guid> oldPasswordRepo,
    IEntityRepository<UserProfile, Guid> userProfileRepo,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IUserService
{
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<OldPassword, Guid> _oldPassword_repo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly ITokenService _token_service = tokenService;

    /// <summary>
    /// Получить список пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (минимум 1).</param>
    /// <param name="pageSize">Размер страницы (1-100).</param>
    /// <returns>Кортеж из списка пользователей и общего количества.</returns>
    public async Task<(IReadOnlyList<User> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

        var all = (await _userRepo.GetAllAsync()).ToList();
        var ordered = all.OrderBy(u => u.CreatedAt).ToList();
        var total = ordered.Count;
        var skip = (page - 1) * pageSize;
        var items = ordered
            .Skip(skip)
            .Take(pageSize)
            .Select(u => u)
            .ToList();

        return (items, total);
    }

    /// <summary>
    /// Получить пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>DTO пользователя или null, если не найден.</returns>
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        var userDto = mapper.Map<UserDto>(user);

        return user is null ? null : userDto;
    }

    /// <summary>
    /// Создать пользователя (только для роли admin).
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь.</returns>
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

        var userDto = mapper.Map<UserDto>(user);

        return userDto;
    }

    /// <summary>
    /// Обновить данные пользователя. При изменении пароля сохраняет хеш в историю.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный пользователь или null, если не найден.</returns>
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
            await _oldPassword_repo.CreateAsync(oldPwd);

            user.Hash = _passwordHasher.Generate(dto.NewPassword);
        }

        var ok = await _userRepo.UpdateAsync(user, id);
        var userDto = mapper.Map<UserDto>(user);

        return ok ? userDto : null;
    }

    /// <summary>
    /// Удалить пользователя и отозвать все refresh токены.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если операция прошла успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        await _token_service.RevokeRefreshTokenAsync(id);
        return await _userRepo.DeleteAsync(id);
    }

    /// <summary>
    /// Регистрация нового пользователя и создание access/refresh токенов.
    /// </summary>
    /// <param name="dto">Данные для регистрации.</param>
    /// <returns>
    /// Токены доступа и данные пользователя или null, если пользователь с таким телефоном уже существует.
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

        var accessToken = _token_service.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var refreshToken = _token_service.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _token_service.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

        var userDto = mapper.Map<UserDto>(user);

        return new LoginResponseDto(accessToken, refreshToken, userDto);
    }

    /// <summary>
    /// Вход пользователя по телефону и паролю. Блокирует временно после серии неудачных попыток.
    /// </summary>
    /// <param name="dto">Данные для входа.</param>
    /// <returns>Токены доступа и данные пользователя или null при ошибке аутентификации.</returns>
    public async Task<LoginResultDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        // Пользователь может автоматически стать неактивным, а.к. логин через
        if (user is null)
        {
            return new LoginResultDto(false, Failure: LoginFailureReason.NotFound);
        }
        else
        {
            //if (!user.IsActive)
            //    return new LoginResultDto(false, Failure: LoginFailureReason.Inactive);

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

            var accessToken = _token_service.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
            var refreshToken = _token_service.GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _token_service.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

            var userDto = mapper.Map<UserDto>(user);
            var payload = new LoginResponseDto(
                AccessToken: accessToken,
                RefreshToken: refreshToken,
                User: userDto
            );

            return new LoginResultDto(true, Data: payload);
        }
    }

    /// <summary>
    /// Обновить access/refresh токены при наличии валидного refresh токена.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Существующий refresh токен.</param>
    /// <returns>Новая пара токенов или null при невалидном токене/пользователе.</returns>
    public async Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        var validToken = await _token_service.ValidateRefreshTokenAsync(userId, refreshToken);
        if (validToken is null)
        {
            return null;
        }

        var accessToken = _token_service.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
        var newRefreshToken = _token_service.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _token_service.SaveRefreshTokenAsync(user.Id, newRefreshToken, refreshTokenExpiry);

        return new RefreshTokenResponseDto(accessToken, newRefreshToken);
    }

    /// <summary>
    /// Выход пользователя: отзыв refresh токенов.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Всегда true после успешной отмены.</returns>
    public async Task<bool> LogoutAsync(Guid userId)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user is null) return false;
        user.IsActive = false;
        await _userRepo.UpdateAsync(user, userId);
        await _token_service.RevokeRefreshTokenAsync(userId);
        return true;
    }

    /// <summary>
    /// Cоздать access/refresh токены для пользователя, сменившего роль.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для cмены роли.</param>
    /// <returns>Токены доступа и данные пользователя.</returns>
    public async Task<LoginResponseDto?> GenerateTokenAsync(Guid id, UserDto dto)
    {
        var accessToken = _token_service.GenerateAccessToken(dto.Phone, dto.Role ?? "common", id);
        var refreshToken = _token_service.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _token_service.SaveRefreshTokenAsync(id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, dto);
    }
}
