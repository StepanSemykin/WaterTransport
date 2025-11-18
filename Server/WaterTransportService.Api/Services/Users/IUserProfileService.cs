using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Интерфейс сервиса для работы с профилями пользователей.
/// </summary>
public interface IUserProfileService
{
    /// <summary>
    /// Получить список профилей с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<UserProfileDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить профиль по идентификатору пользователя.
    /// </summary>
    Task<UserProfileDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый профиль пользователя.
    /// </summary>
    Task<UserProfileDto?> CreateAsync(CreateUserProfileDto dto);

    /// <summary>
    /// Обновить существующий профиль.
    /// </summary>
    Task<UserProfileDto?> UpdateAsync(Guid id, UpdateUserProfileDto dto);

    /// <summary>
    /// Удалить профиль.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
