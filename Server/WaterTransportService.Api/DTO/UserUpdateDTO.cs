using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public class UpdateUserDto
{
    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(64)]
    public string? Nickname { get; set; }

    public bool? IsActive { get; set; }

    public int[]? Roles { get; set; }

    // Если передан — обновим пароль
    [MinLength(6)]
    public string? NewPassword { get; set; }
}