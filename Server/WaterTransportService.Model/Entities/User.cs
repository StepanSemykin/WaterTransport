using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Основная сущность пользователя.
/// </summary>
[Table("users")]
public class User : BaseEntity
{
    /// <summary>
    /// Первичный GUID-идентификатор пользователя.
    /// </summary
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Uuid { get; set; }

    /// <summary>
    /// Профиль пользователя (1:1 связь).
    /// </summary>
    public UserProfile? UserProfile { get; set; }

    /// <summary>
    /// Номер телефона пользователя.
    /// </summary>
    [Required]
    [MaxLength(20)]
    [Column("phone")]
    public required string Phone { get; set; }

    /// <summary>
    /// Никнейм пользователя.
    /// </summary>
    [Required]
    [MaxLength(64)]
    [Column("nickname")]
    public required string Nickname { get; set; }

    /// <summary>
    /// Время создания аккаунта в UTC.
    /// </summary>
    [Required]
    [Column("created_at", TypeName = "timestamptz")]
    public new DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время последнего входа пользователя в UTC.
    /// </summary>
    [Column("last_login_at", TypeName = "timestamptz")]
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Флаг активности аккаунта.
    /// </summary>
    [Required]
    [Column("is_active")]
    public required bool IsActive { get; set; }

    /// <summary>
    /// Счётчик неудачных попыток входа.
    /// </summary>
    [Column("failed_login_attempts")]
    public int? FailedLoginAttempts { get; set; }

    /// <summary>
    /// Время до которого аккаунт заблокирован (если есть).
    /// </summary>
    [Column("locked_until", TypeName = "timestamptz")]
    public DateTime? LockedUntil { get; set; }

    /// <summary>
    /// Роли пользователя.
    /// </summary>
    public int[] Roles { get; set; } = [];

    /// <summary>
    /// Старые записи паролей пользователя.
    /// </summary>
    public ICollection<OldPassword> OldPasswords { get; set; } = [];

    /// <summary>
    /// Соль, используемая при хешировании пароля.
    /// </summary>
    [Column("salt")]
    [Required]
    public required string Salt { get; set; }

    /// <summary>
    /// Хеш пароля.
    /// </summary>
    [Column("hash")]
    [Required]
    public required string Hash { get; set; }

    /// <summary>
    /// Бронирования, созданные пользователем.
    /// </summary>
    public ICollection<Booking> Bookings { get; set; } = [];

    /// <summary>
    /// Отзывы, оставленные пользователем (как автор).
    /// </summary>
    public ICollection<Review> Reviews { get; set; } = [];

    /// <summary>
    /// Отзывы, полученные пользователем (как объект отзыва). 
    /// </summary>
    public ICollection<Review> ReceivedReviews { get; set; } = [];

    /// <summary>
    /// Судна, принадлежащие пользователю.
    /// </summary>
    public ICollection<Ship> Ships { get; set; } = [];

    /// <summary>
    /// Календарные записи/рейсы, связанные с пользователем.
    /// </summary>
    public ICollection<Calendar> Calendars { get; set; } = [];


}
