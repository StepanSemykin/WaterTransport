using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Exceptions;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Authentication.Services;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;
using AuthUserDto = WaterTransportService.Authentication.DTO.UserDto;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// ������ ���������� ��������������.
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
    private readonly IEntityRepository<OldPassword, Guid> _oldPasswordRepo = oldPasswordRepo;
    private readonly IEntityRepository<UserProfile, Guid> _userProfileRepo = userProfileRepo;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly ITokenService _tokenService = tokenService;

    /// <summary>
    /// �������� ������ ������������� � ����������.
    /// </summary>
    /// <param name="page">����� �������� (������� 1).</param>
    /// <param name="pageSize">������ �������� (1-100).</param>
    /// <returns>������ �� ������ ������������� � ������ ����������.</returns>
    public async Task<(IReadOnlyList<User> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

        var all = (await userRepo.GetAllAsync()).ToList();
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
    /// �������� ������������ �� ��������������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <returns>DTO ������������ ��� null, ���� �� ������.</returns>
    public async Task<AuthUserDto?> GetByIdAsync(Guid id)
    {
        var user = await userRepo.GetByIdAsync(id);
        var userDto = mapper.Map<AuthUserDto>(user);

        return user is null ? null : userDto;
    }

    /// <summary>
    /// ������� ������������ (������ ��� ���� admin).
    /// </summary>
    /// <param name="dto">������ ��� �������� ������������.</param>
    /// <returns>��������� ������������.</returns>
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
            Hash = passwordHasher.Generate(dto.Password)
        };

        await userRepo.CreateAsync(user);

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
        await userProfileRepo.CreateAsync(profile);

        var userDto = mapper.Map<AuthUserDto>(user);

        return userDto;
    }

    /// <summary>
    /// �������� ������ ������������. ��� ��������� ������ ��������� ��� � �������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <param name="dto">������ ��� ����������.</param>
    /// <returns>����������� ������������ ��� null, ���� �� ������.</returns>
    /// <exception cref="DuplicatePasswordException">�������������, ���� ����� ������ ��������� � ������� ��� ����� ���������������.</exception>
    public async Task<AuthUserDto?> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await userRepo.GetByIdAsync(id);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.Role is not null) user.Role = dto.Role;

        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
            var oldPasswords = (await oldPasswordRepo.GetAllAsync())
                .Where(op => op.UserId == user.Id)
                .ToList();

            foreach (var oldPwd in oldPasswords)
            {
                if (passwordHasher.Verify(dto.NewPassword, oldPwd.Hash))
                {
                    throw new DuplicatePasswordException("����� ������ �� ������ ��������� � ����� ��������������� ��������.");
                }
            }

            if (passwordHasher.Verify(dto.NewPassword, user.Hash))
            {
                throw new DuplicatePasswordException("����� ������ �� ������ ��������� � ������� �������.");
            }

            var oldPassword = new OldPassword
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                User = user,
                Hash = user.Hash,
                CreatedAt = DateTime.UtcNow
            };
            user.OldPasswords.Add(oldPassword);
            await oldPasswordRepo.CreateAsync(oldPassword);

            user.Hash = passwordHasher.Generate(dto.NewPassword);
        }

        var ok = await userRepo.UpdateAsync(user, id);
        var userDto = mapper.Map<AuthUserDto>(user);

        return ok ? userDto : null;
    }

    /// <summary>
    /// ������� ������������ � �������� ��� refresh ������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <returns>True, ���� �������� ������ �������.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        await tokenService.RevokeRefreshTokenAsync(id);
        return await userRepo.DeleteAsync(id);
    }

    /// <summary>
    /// C������ access/refresh ������ ��� ������������, ���������� ����.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <param name="dto">������ ��� c���� ����.</param>
    /// <returns>������ ������� � ������ ������������.</returns>
    public async Task<LoginResponseDto?> GenerateTokenAsync(Guid id, AuthUserDto dto)
    {
        var accessToken = tokenService.GenerateAccessToken(dto.Phone, dto.Role ?? "common", id);
        var refreshToken = tokenService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await tokenService.SaveRefreshTokenAsync(id, refreshToken, refreshTokenExpiry);

        return new LoginResponseDto(accessToken, refreshToken, dto);
    }
}
