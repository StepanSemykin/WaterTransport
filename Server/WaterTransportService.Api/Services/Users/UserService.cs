using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Exceptions;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Authentication.Services;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Infrastructure.PasswordValidator;   
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;
using AuthUserDto = WaterTransportService.Authentication.DTO.UserDto;

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
    IPasswordValidator passwordValidator,
    ITokenService tokenService) : IUserService
{
    private readonly IMapper _mapper = mapper;
    private readonly IUserRepository<Guid> _userRepo = userRepo;
    private readonly IEntityRepository<OldPassword, Guid> _oldPasswordRepo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IPasswordValidator _passwordValidator = passwordValidator;
    private readonly ITokenService _tokenService = tokenService;

    /// <summary>
    /// Получить список пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (минимум 1).</param>
    /// <param name="pageSize">Размер страницы (1-100).</param>
    /// <returns>Кортеж со списком пользователей и общим количеством.</returns>
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
    public async Task<AuthUserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        var userDto = _mapper.Map<AuthUserDto>(user);

        return user is null ? null : userDto;
    }

    /// <summary>
    /// Создать пользователя (только для роли admin).
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь.</returns>
    [Authorize(Roles = "admin")]
    public async Task<AuthUserDto> CreateAsync(CreateUserDto dto)
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

        var userDto = _mapper.Map<AuthUserDto>(user);

        return userDto;
    }

    /// <summary>
    /// Обновить данные пользователя. При изменении пароля проверяет его на дубликаты.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный пользователь или null, если не найден.</returns>
    /// <exception cref="DuplicatePasswordException">Выбрасывается, если новый пароль совпадает с текущим или ранее использованным.</exception>
    public async Task<AuthUserDto?> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.Role is not null) user.Role = dto.Role;

        // Проверка смены пароля
        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
            // Проверка текущего пароля
            if (string.IsNullOrEmpty(dto.CurrentPassword) || !_passwordHasher.Verify(dto.CurrentPassword, user.Hash))
            {
                throw new ArgumentException("Текущий пароль неверен.");
            }

            // Валидация нового пароля
            if (!_passwordValidator.IsPasswordValid(dto.NewPassword))
            {
                throw new ArgumentException("Пароль не соответствует требованиям безопасности.");
            }

            // Проверяем, что новый пароль не совпадает с текущим
            if (_passwordHasher.Verify(dto.NewPassword, user.Hash))
            {
                throw new DuplicatePasswordException("Новый пароль не должен совпадать с текущим паролем.");
            }

            // Получаем старые пароли пользователя
            var oldPasswords = (await _oldPasswordRepo.GetAllAsync())
                .Where(op => op.UserId == user.Id)
                .ToList();

            // Проверяем, что новый пароль не совпадает со старыми
            foreach (var oldPwd in oldPasswords)
            {
                if (_passwordHasher.Verify(dto.NewPassword, oldPwd.Hash))
                {
                    throw new DuplicatePasswordException("Новый пароль не должен совпадать с ранее использованными паролями.");
                }
            }

            // Сохраняем текущий пароль в историю
            var oldPassword = new OldPassword
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Hash = user.Hash,
                CreatedAt = DateTime.UtcNow
            };
            await _oldPasswordRepo.CreateAsync(oldPassword);

            // Устанавливаем новый пароль
            user.Hash = _passwordHasher.Generate(dto.NewPassword);
        }

        var ok = await _userRepo.UpdateAsync(user, id);
        var userDto = _mapper.Map<AuthUserDto>(user);

        return ok ? userDto : null;
    }


    /// <summary>
    /// Удалить пользователя и отозвать его refresh токены.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если операция прошла успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        await _tokenService.RevokeRefreshTokenAsync(id);
        return await _userRepo.DeleteAsync(id);
    }

    /// <summary>
    /// Создать access/refresh токены для пользователя, прошедшего вход.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для создания токенов.</param>
    /// <returns>Ответ с токенами и данными пользователя.</returns>
    public async Task<LoginResponseDto?> GenerateTokenAsync(Guid id, AuthUserDto dto)
    {
        var accessToken = _tokenService.GenerateAccessToken(dto.Phone, dto.Role ?? "common", id);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _tokenService.SaveRefreshTokenAsync(id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, dto);
    }
}
