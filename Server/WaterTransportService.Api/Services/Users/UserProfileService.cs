using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Middleware.Exceptions;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Сервис для работы с профилями пользователей.
/// </summary>
public class UserProfileService(IEntityRepository<UserProfile, Guid> repo, IMapper mapper) : IUserProfileService
{
    private readonly IEntityRepository<UserProfile, Guid> _repo = repo;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Получить список всех профилей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (минимум 1).</param>
    /// <param name="pageSize">Размер страницы (1-100).</param>
    /// <returns>Кортеж со списком профилей и общим количеством.</returns>
    public async Task<(IReadOnlyList<UserProfileDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.UserId).ToList();
        var total = all.Count;
        var pageItems = all
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();
        var items = _mapper.Map<List<UserProfileDto>>(pageItems);

        return (items, total);
    }

    /// <summary>
    /// Получить профиль по идентификатору пользователя.
    /// </summary>
    /// <param name="id">Идентификатор профиля пользователя.</param>
    /// <returns>DTO профиля или null, если не найден.</returns>
    public async Task<UserProfileDto?> GetByIdAsync(Guid id)
    {
        var userProfile = await _repo.GetByIdAsync(id);
        var userProfileDto = _mapper.Map<UserProfileDto>(userProfile);

        return userProfile is null ? null : userProfileDto;
    }

    /// <summary>
    /// Создать профиль пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания профиля.</param>
    /// <remarks>
    /// Метод не используется, так как профиль создается вместе с пользователем.
    /// </remarks>
    /// <returns>Всегда null.</returns>
    public async Task<UserProfileDto?> CreateAsync(CreateUserProfileDto dto)
    {
        // метод не нужен, т.к. профиль создается вместе с пользователем
        await Task.CompletedTask;
        return null;
    }

    /// <summary>
    /// Обновить профиль пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления профиля.</param>
    /// <returns>Обновленный профиль или null, если профиль не найден.</returns>
    public async Task<UserProfileDto?> UpdateAsync(Guid id, UpdateUserProfileDto dto)
    {
        var userProfile = await _repo.GetByIdAsync(id);
        if (userProfile is null) return null;

        var needsUniqueCheck = !string.IsNullOrWhiteSpace(dto.Nickname) || !string.IsNullOrWhiteSpace(dto.Email);
        var otherProfiles = needsUniqueCheck
            ? (await _repo.GetAllAsync()).Where(p => p.UserId != id).ToList()
            : new List<UserProfile>();

        if (!string.IsNullOrWhiteSpace(dto.Nickname))
        {
            var normalizedNickname = dto.Nickname.Trim();
            var nicknameExists = otherProfiles.Any(p =>
                !string.IsNullOrWhiteSpace(p.Nickname) &&
                string.Equals(p.Nickname, normalizedNickname, StringComparison.OrdinalIgnoreCase));
            if (nicknameExists)
            {
                throw new DuplicateFieldValueException("никнеймом", normalizedNickname);
            }

            userProfile.Nickname = normalizedNickname;
        }

        if (!string.IsNullOrWhiteSpace(dto.FirstName)) userProfile.FirstName = dto.FirstName;
        if (!string.IsNullOrWhiteSpace(dto.LastName)) userProfile.LastName = dto.LastName;
        if (!string.IsNullOrWhiteSpace(dto.Patronymic)) userProfile.Patronymic = dto.Patronymic;

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var normalizedEmail = dto.Email.Trim();
            var emailExists = otherProfiles.Any(p =>
                !string.IsNullOrWhiteSpace(p.Email) &&
                string.Equals(p.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase));
            if (emailExists)
            {
                throw new DuplicateFieldValueException("email", normalizedEmail);
            }

            userProfile.Email = normalizedEmail;
        }

        if (dto.Birthday.HasValue) userProfile.Birthday = dto.Birthday.Value;
        if (!string.IsNullOrWhiteSpace(dto.About)) userProfile.About = dto.About;
        if (!string.IsNullOrWhiteSpace(dto.Location)) userProfile.Location = dto.Location;
        //if (dto.IsPublic.HasValue) userProfile.IsPublic = dto.IsPublic.Value;
        userProfile.UpdatedAt = DateTime.UtcNow;
        var ok = await _repo.UpdateAsync(userProfile, id);

        var userProfileDto = _mapper.Map<UserProfileDto>(userProfile);

        return ok ? userProfileDto : null;
    }

    /// <summary>
    /// Удалить профиль пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);
}
