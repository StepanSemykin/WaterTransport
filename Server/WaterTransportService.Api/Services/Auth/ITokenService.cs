namespace WaterTransportService.Api.Services.Auth;

/// <summary>
/// Сервис генерации и валидации JWT и refresh токенов.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Сгенерировать JWT access токен.
    /// </summary>
    /// <param name="phone">Телефон пользователя.</param>
    /// <param name="role">Роль пользователя.</param>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Строка access токена.</returns>
    string GenerateAccessToken(string phone, string role, Guid userId);

    /// <summary>
    /// Сгенерировать случайный refresh токен.
    /// </summary>
    /// <returns>Строка refresh токена.</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Провалидировать refresh токен пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Refresh токен.</param>
    /// <returns>Refresh токен (валидный) или null.</returns>
    Task<string?> ValidateRefreshTokenAsync(Guid userId, string refreshToken);

    /// <summary>
    /// Сохранить refresh токен с датой истечения.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Refresh токен.</param>
    /// <param name="expiresAt">Дата истечения.</param>
    Task SaveRefreshTokenAsync(Guid userId, string refreshToken, DateTime expiresAt);

    /// <summary>
    /// Отозвать (удалить/деактивировать) refresh токен пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    Task RevokeRefreshTokenAsync(Guid userId);
}
