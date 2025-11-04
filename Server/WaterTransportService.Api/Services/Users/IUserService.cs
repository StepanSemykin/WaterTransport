using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Сервис для управления пользователями и аутентификацией.
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Получить список пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком пользователей и общим количеством.</returns>
    Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>DTO пользователя или null, если не найден.</returns>
    Task<UserDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь.</returns>
    Task<UserDto> CreateAsync(CreateUserDto dto);

    /// <summary>
    /// Обновить существующего пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный пользователь или null при ошибке.</returns>
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto);

    /// <summary>
    /// Удалить пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    Task<bool> DeleteAsync(Guid id);

    // Блок аутентификации

    /// <summary>
    /// Регистрация нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для регистрации.</param>
    /// <returns>Ответ с токенами или null, если пользователь уже существует.</returns>
    Task<LoginResponseDto?> RegisterAsync(RegisterDto dto);

    /// <summary>
    /// Аутентификация пользователя.
    /// </summary>
    /// <param name="dto">Данные для входа.</param>
    /// <returns>Ответ с токенами или null при ошибке аутентификации.</returns>
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);

    /// <summary>
    /// Обновить токены по refresh токену.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Refresh токен.</param>
    /// <returns>Новая пара токенов или null при ошибке.</returns>
    Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken);

    /// <summary>
    /// Отозвать refresh токен пользователя (logout).
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>True, если операция успешна.</returns>
    Task<bool> LogoutAsync(Guid userId);
}
