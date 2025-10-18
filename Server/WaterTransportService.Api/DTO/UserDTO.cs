using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record UserDto(
    Guid Uuid,
    string Phone,
    string Nickname,
    DateTime CreatedAt,
    DateTime? LastLoginAt,
    bool IsActive,
    int? FailedLoginAttempts,
    DateTime? LockedUntil,
    int[] Roles
);
