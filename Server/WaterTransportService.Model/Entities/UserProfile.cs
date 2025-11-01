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
    /// Идентификатор пользователя (внешний ключ на User).
    /// </summary>
    [Key]
    [ForeignKey(nameof(User))]
    [Column("user_uuid", TypeName = "uuid")]
    [Required]
    public required Guid UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на основного пользователя.
    /// </summary>
    public required User User { get; set; }

    /// <summary>
    /// Никнейм пользователя.
    /// </summary>
    [MaxLength(16)]
    [Column("nickname")]
    public string? Nickname { get; set; }

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    [MaxLength(32)]
    [Column("first_name")]
    public string? FirstName { get; set; }

    /// <summary>
    /// Фамилия пользователя.
    /// </summary>
    [MaxLength(32)]
    [Column("last_name")]
    public string? LastName { get; set; }

    /// <summary>
    /// Отчество пользователя.
    /// </summary>
    [MaxLength(32)]
    [Column("patronymic")]
    public string? Patronymic { get; set; }

    /// <summary>
    /// Адрес электронной почты в профиле (опционально).
    /// </summary>
    [EmailAddress]
    [MaxLength(32)]
    [Column("email")]   
    public string? Email { get; set; }

    /// <summary>
    /// Дата рождения (опционально).
    /// </summary>
    [Column("birthday", TypeName = "date")]
    public DateTime? Birthday { get; set; }

    /// <summary>
    /// Коллекция изображений пользователя.
    /// </summary>
    public ICollection<UserImage> UserImages { get; set; } = [];

    /// <summary>
    /// Краткое описание/о себе.
    /// </summary>
    [MaxLength(512)]
    [Column("about")]
    public string? About { get; set; }

    /// <summary>
    /// Местоположение (город/страна).
    /// </summary>
    [MaxLength(256)]
    [Column("location")]
    public string? Location { get; set; }

    /// <summary>
    /// Публичный флаг видимости профиля.
    /// </summary>
    [Column("is_public")]
    public bool IsPublic { get; set; } = true;

    /// <summary>
    /// Время последнего обновления профиля в UTC.
    /// </summary>
    [Column("updated_at", TypeName = "timestamptz")]
    public new DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
}
