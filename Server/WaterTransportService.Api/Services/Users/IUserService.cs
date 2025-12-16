using WaterTransportService.Api.DTO;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Model.Entities;
using AuthUserDto = WaterTransportService.Authentication.DTO.UserDto;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// Интерфейс сервиса для управления пользователями
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
    Task<AuthUserDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь.</returns>
    Task<AuthUserDto> CreateAsync(CreateUserDto dto);

    /// <summary>
    /// Обновить существующего пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный пользователь или null при ошибке.</returns>
    Task<AuthUserDto?> UpdateAsync(Guid id, UpdateUserDto dto);

    /// <summary>
    /// Удалить пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    Task<bool> DeleteAsync(Guid id);

    /// <summary>
    /// Cоздать access/refresh токены для пользователя, сменившего роль.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="dto">Данные для cмены роли.</param>
    /// <returns>Токены доступа и данные пользователя.</returns>
    Task<LoginResponseDto?> GenerateTokenAsync(Guid id, AuthUserDto dto);
}
