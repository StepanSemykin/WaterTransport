using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Authentication.DTO;

/// <summary>
/// DTO для входа пользователя.
/// </summary>
public class LoginDto
{
    [Required, MaxLength(20)]
    public string Phone { get; set; } = default!;

    [Required, MinLength(8)]
    public string Password { get; set; } = default!;
}

/// <summary>
/// DTO для регистрации нового пользователя.
/// </summary>
public record RegisterDto(
    [Required, MaxLength(20)] string Phone,
    [Required, MinLength(8)] string Password
);

/// <summary>
/// DTO для ответа новому пользователю на попытку регистрации.
/// </summary>
public class RegisterResultDto
{
    public bool Success { get; set; }
    public string? Error { get; set; }
    public LoginResponseDto? Data { get; set; }

    public RegisterResultDto(bool success, string? error = null, LoginResponseDto? data = null)
    {
        Success = success;
        Error = error;
        Data = data;
    }
}

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

/// <summary>
/// DTO для изменения пароля пользователя.
/// </summary>
public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
