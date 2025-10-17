using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public class CreateUserDto
{
    [Required, MaxLength(20)]
    public string Phone { get; set; } = default!;

    [Required, MaxLength(64)]
    public string Nickname { get; set; } = default!;

    [Required, MinLength(6)]
    public string Password { get; set; } = default!;

    public bool IsActive { get; set; } = true;

    // опционально: роли при создании
    public int[]? Roles { get; set; }
}