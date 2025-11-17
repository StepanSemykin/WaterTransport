using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record UserProfileDto(
    //Guid UserId,
    string? Nickname,
    string? FirstName,
    string? LastName,
    string? Patronymic,
    string? Email,
    DateTime? Birthday,
    string? About,
    string? Location
//bool IsPublic
//DateTime? UpdatedAt
);

public class CreateUserProfileDto
{
    //[Required]
    //public required Guid UserId { get; set; }

    [MaxLength(16)]
    public string? Nickname { get; set; }

    [MaxLength(32)]
    public string? FirstName { get; set; }

    [MaxLength(32)]
    public string? LastName { get; set; }

    [MaxLength(32)]
    public string? Patronymic { get; set; }

    [EmailAddress, MaxLength(32)]
    public string? Email { get; set; }

    public DateTime? Birthday { get; set; }

    [MaxLength(512)]
    public string? About { get; set; }

    [MaxLength(256)]
    public string? Location { get; set; }

    //public bool IsPublic { get; set; } = true;
}

public class UpdateUserProfileDto
{
    [MaxLength(16)]
    public string? Nickname { get; set; }

    [MaxLength(32)]
    public string? FirstName { get; set; }

    [MaxLength(32)]
    public string? LastName { get; set; }

    [MaxLength(32)]
    public string? Patronymic { get; set; }

    [EmailAddress, MaxLength(256)]
    public string? Email { get; set; }

    public DateTime? Birthday { get; set; }

    [MaxLength(256)]
    public string? About { get; set; }

    [MaxLength(256)]
    public string? Location { get; set; }

    //public bool? IsPublic { get; set; }
}
