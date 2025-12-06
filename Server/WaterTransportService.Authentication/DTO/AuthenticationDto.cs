using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Authentication.DTO;

/// <summary>
/// DTO для входа пользователя.
/// </summary>
public class LoginDto
{
    [Required, MaxLength(20)]
    public string Phone { get; set; } = default!;
    
    [Required, MinLength(6)]
    public string Password { get; set; } = default!;
}

/// <summary>
/// DTO для регистрации нового пользователя.
/// </summary>
public record RegisterDto(
    [Required, MaxLength(20)] string Phone,
    [Required, MinLength(6)] string Password
);

/// <summary>
/// DTO пользователя для передачи клиенту.
/// </summary>
public record UserDto(
    Guid Id,
    string Phone,
    string? Role
);

/// <summary>
/// DTO ответа при успешной аутентификации.
/// </summary>
public record LoginResponseDto(
    string AccessToken,
    string RefreshToken,
    UserDto User
);

/// <summary>
/// DTO ответа при обновлении токенов.
/// </summary>
public record RefreshTokenResponseDto(
    string AccessToken,
    string RefreshToken
);

/// <summary>
/// Причины неудачной аутентификации.
/// </summary>
public enum LoginFailureReason
{
    /// <summary>
    /// Пользователь не найден.
    /// </summary>
    NotFound,
    
    /// <summary>
    /// Учетная запись неактивна.
    /// </summary>
    Inactive,
    
    /// <summary>
    /// Учетная запись заблокирована.
    /// </summary>
    Locked,
    
    /// <summary>
    /// Неверный пароль.
    /// </summary>
    InvalidPassword
}

/// <summary>
/// DTO результата попытки входа.
/// </summary>
public sealed record LoginResultDto(
    bool Success,
    LoginResponseDto? Data = null,
    LoginFailureReason? Failure = null,
    DateTimeOffset? LockedUntil = null,
    int? RemainingAttempts = null
);
