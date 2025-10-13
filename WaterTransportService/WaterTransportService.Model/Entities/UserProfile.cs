using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Расширенный профиль пользователя с дополнительными метаданными.
/// </summary>
[Table("users_profiles")]
public class UserProfile : BaseEntity
{
    /// <summary>
    /// FK на User.Uuid (1:1 связь с сущностью User).
    /// </summary>
    [Key]
    [ForeignKey(nameof(User))]
    [Column("user_uuid", TypeName = "uuid")]
    [Required]
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    [InverseProperty(nameof(User.Profile))]
    [Column("user")]
    public required User User { get; set; }

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    [MaxLength(128)]
    public string? FirstName { get; set; }

    /// <summary>
    /// Фамилия пользователя.
    /// </summary>
    [MaxLength(128)]
    public string? LastName { get; set; }

    /// <summary>
    /// Отчество пользователя.
    /// </summary>
    [MaxLength(128)]
    public string? Patronymic { get; set; }

    /// <summary>
    /// Адрес электронной почты в профиле (опционально).
    /// </summary>
    [EmailAddress]
    [MaxLength(256)]
    public string? Email { get; set; }

    /// <summary>
    /// Дата рождения (опционально).
    /// </summary>
    public DateTime? Birthday { get; set; }

    /// <summary>
    /// Коллекция изображений пользователя.
    /// </summary>
    public ICollection<UserImage> Images { get; set; } = new List<UserImage>();

    /// <summary>
    /// Краткое описание/о себе.
    /// </summary>
    [MaxLength(1000)]
    public string? About { get; set; }

    /// <summary>
    /// Местоположение (город/страна).
    /// </summary>
    [MaxLength(256)]
    public string? Location { get; set; }

    /// <summary>
    /// Публичный флаг видимости профиля.
    /// </summary>
    public bool IsPublic { get; set; } = true;

    /// <summary>
    /// Время последнего обновления профиля в UTC.
    /// </summary>
    public new DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
}
