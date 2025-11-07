using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record UserDto(
    Guid Id,
    string Phone,
    DateTime CreatedAt,
    DateTime? LastLoginAt,
    bool IsActive,
    int? FailedLoginAttempts,
    DateTime? LockedUntil,
    string? Role
);

public class CreateUserDto
{
    [Required, MaxLength(20)]
    public string Phone { get; set; } = default!;

    [Required, MinLength(6)]
    public string Password { get; set; } = default!;

    public bool IsActive { get; set; } = true;

    // опционально: роли при создании
    public string? Role{ get; set; }
}

public class UpdateUserDto
{
    [MaxLength(20)]
    public string? Phone { get; set; }

    public bool? IsActive { get; set; }

    public string? Role { get; set; }

    // Если передан — обновим пароль
    [MinLength(6)]
    public string? NewPassword { get; set; } = null!;
}