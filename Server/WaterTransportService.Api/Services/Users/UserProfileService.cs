using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Сервис для работы с профилями пользователей.
/// </summary>
public class UserProfileService(IEntityRepository<UserProfile, Guid> repo) : IUserProfileService
{
    private readonly IEntityRepository<UserProfile, Guid> _repo = repo;

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
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить профиль по идентификатору пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>DTO профиля или null, если не найден.</returns>
    public async Task<UserProfileDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
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
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Nickname)) entity.Nickname = dto.Nickname;
        if (!string.IsNullOrWhiteSpace(dto.FirstName)) entity.FirstName = dto.FirstName;
        if (!string.IsNullOrWhiteSpace(dto.LastName)) entity.LastName = dto.LastName;
        if (!string.IsNullOrWhiteSpace(dto.Patronymic)) entity.Patronymic = dto.Patronymic;
        if (!string.IsNullOrWhiteSpace(dto.Email)) entity.Email = dto.Email;
        if (dto.Birthday.HasValue) entity.Birthday = dto.Birthday.Value;
        if (!string.IsNullOrWhiteSpace(dto.About)) entity.About = dto.About;
        if (!string.IsNullOrWhiteSpace(dto.Location)) entity.Location = dto.Location;
        if (dto.IsPublic.HasValue) entity.IsPublic = dto.IsPublic.Value;
        entity.UpdatedAt = DateTime.UtcNow;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить профиль пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность профиля в DTO.
    /// </summary>
    private static UserProfileDto MapToDto(UserProfile e) => new(e.UserId, e.Nickname, e.FirstName, e.LastName, e.Patronymic, e.Email, e.Birthday, e.About, e.Location, e.IsPublic, e.UpdatedAt);
}
