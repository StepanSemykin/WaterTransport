using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Интерфейс сервиса для управления пользователями и аутентификацией
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Получить список пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж из списка пользователей и общего количества.</returns>
    Task<(IReadOnlyList<User> Items, int Total)> GetAllAsync(int page, int pageSize);

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
    /// Зарегистрировать нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для регистрации.</param>
    /// <returns>Токены и профиль или null, если пользователь уже существует.</returns>
    Task<LoginResponseDto?> RegisterAsync(RegisterDto dto);

    /// <summary>
    /// Аутентифицировать пользователя.
    /// </summary>
    /// <param name="dto">Данные для входа.</param>
    /// <returns>Токены и профиль или null при ошибке аутентификации.</returns>
    Task<LoginResultDto?> LoginAsync(LoginDto dto);

    /// <summary>
    /// Обновить токены по refresh токену.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Refresh токен.</param>
    /// <returns>Новая пара токенов или null при ошибке.</returns>
    Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken);

    /// <summary>
    /// Отозвать refresh токены пользователя (logout).
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>True, если операция успешна.</returns>
    Task<bool> LogoutAsync(Guid userId);

    /// <summary>
    /// Cоздать access/refresh токены для пользователя, сменившего роль.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для cмены роли.</param>
    /// <returns>Токены доступа и данные пользователя.</returns>
    Task<LoginResponseDto?> GenerateTokenAsync(Guid id, UserDto dto);
}
