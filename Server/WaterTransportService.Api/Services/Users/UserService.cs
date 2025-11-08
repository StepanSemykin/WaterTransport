using Microsoft.AspNetCore.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Auth;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Сервис управления пользователями: CRUD, аутентификация, вход и управление токенами.
/// </summary>
public class UserService(
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
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 10, максимум 100).</param>
    /// <returns>Кортеж: список пользователей в виде DTO и общее количество записей.</returns>
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
    /// Получить пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>DTO пользователя или null, если пользователь не найден.</returns>
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        return user is null ? null : MapToDto(user);
    }

    /// <summary>
    /// Создать пользователя (доступно только для роли admin).
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь в виде DTO.</returns>
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
    /// Обновить данные пользователя. При необходимости обновляет пароль и сохраняет предыдущий хеш.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновлённый DTO пользователя или null, если пользователь не найден.</returns>
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
        return ok ? MapToDto(user) : null;
    }

    /// <summary>
    /// Удалить пользователя и отозвать его refresh-токен.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если пользователь успешно удалён.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        await _token_service.RevokeRefreshTokenAsync(id);
        return await _userRepo.DeleteAsync(id);
    }

    /// <summary>
    /// Зарегистрировать нового пользователя, сгенерировать и сохранить access/refresh токены.
    /// </summary>
    /// <param name="dto">Данные регистрации.</param>
    /// <returns>LoginResponseDto с access и refresh токенами и DTO пользователя; или null если пользователь уже существует.</returns>
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

        return new LoginResponseDto(accessToken, refreshToken, MapToDto(user));
    }

    /// <summary>
    /// Авторизация пользователя по телефону и паролю. При успешной авторизации генерирует и сохраняет токены.
    /// </summary>
    /// <param name="dto">Данные для входа.</param>
    /// <returns>LoginResultDto с результатом операции и данными (при успехе).</returns>
    public async Task<LoginResultDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByPhoneAsync(dto.Phone);
        // Если пользователь не найден — вернуть соответствующую причину.
        if (user is null)
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

            var accessToken = _token_service.GenerateAccessToken(user.Phone, user.Role ?? "common", user.Id);
            var refreshToken = _token_service.GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _token_service.SaveRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

            var dtoUser = MapToDto(user);
            var payload = new LoginResponseDto(accessToken, refreshToken, dtoUser);

            return new LoginResultDto(true, Data: payload);
        }
    }

    /// <summary>
    /// Обновить пару access/refresh токенов по предоставленному refresh токену.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Refresh токен.</param>
    /// <returns>Новая пара токенов или null при невалидном/просроченном токене.</returns>
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
    /// Выход пользователя: деактивация (если требуется) и отзыв refresh токена.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>True, если операция выполнена успешно.</returns>
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
    /// Преобразовать сущность User в DTO.
    /// </summary>
    private static UserDto MapToDto(User u) =>
        new(u.Id, u.Phone, u.CreatedAt, u.LastLoginAt,
            u.IsActive, u.FailedLoginAttempts, u.LockedUntil, u.Role);
}
