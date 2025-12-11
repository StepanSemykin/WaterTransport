using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Authentication.DTO;

/// <summary>
/// DTO дл€ входа пользовател€.
/// </summary>
public class LoginDto
{
    [Required, MaxLength(20)]
    public string Phone { get; set; } = default!;
    
    [Required, MinLength(8)]
    public string Password { get; set; } = default!;
}

/// <summary>
/// DTO дл€ регистрации нового пользовател€.
/// </summary>
public record RegisterDto(
    [Required, MaxLength(20)] string Phone,
    [Required, MinLength(8)] string Password
);

/// <summary>
/// DTO дл€ ответа новому пользователю на попытку регистрации.
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
/// DTO пользовател€ дл€ передачи клиенту.
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
/// ѕричины неудачной аутентификации.
/// </summary>
public enum LoginFailureReason
{
    /// <summary>
    /// ѕользователь не найден.
    /// </summary>
    NotFound,
    
    /// <summary>
    /// ”четна€ запись неактивна.
    /// </summary>
    Inactive,
    
    /// <summary>
    /// ”четна€ запись заблокирована.
    /// </summary>
    Locked,
    
    /// <summary>
    /// Ќеверный пароль.
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
/// DTO дл€ изменени€ парол€ пользовател€.
/// </summary>
public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
