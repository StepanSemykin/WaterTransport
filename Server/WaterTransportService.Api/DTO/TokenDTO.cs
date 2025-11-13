using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

namespace WaterTransportService.Api.DTO;

public class LoginDto
{
    [Required, MaxLength(20)]
    public string Phone { get; set; } = default!;
    [Required, MinLength(6)]
    public string Password { get; set; } = default!;
}

// Новые DTO для аутентификации
public record RegisterDto(
    [Required, MaxLength(20)] string Phone,
    [Required, MinLength(6)] string Password
);

public record LoginResponseDto(
    string AccessToken,
    string RefreshToken,
    UserDto User
);

public record RefreshTokenResponseDto(
    string AccessToken,
    string RefreshToken
);

public enum LoginFailureReason
{
    NotFound,
    Inactive,   
    Locked,               
    InvalidPassword    
}

public sealed record LoginResultDto(
    bool Success,
    LoginResponseDto? Data = null,
    LoginFailureReason? Failure = null,
    DateTimeOffset? LockedUntil = null,
    int? RemainingAttempts = null
);
