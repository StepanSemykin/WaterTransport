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
    [InverseProperty(nameof(UserProfile.User))]
    public required virtual UserProfile Profile { get; set; }

    /// <summary>
    /// Номер телефона пользователя.
    /// </summary>
    [Required]
    [MaxLength(32)]
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
    [Column("created_at", TypeName = "timestamp")]
    public new DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время последнего входа пользователя в UTC.
    /// </summary>
    [Column("last_login_at", TypeName = "timestamp")]
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Флаг активности аккаунта.
    /// </summary>
    [Required]
    [Column("is_active")]
    public required new bool IsActive { get; set; }

    /// <summary>
    /// Счётчик неудачных попыток входа.
    /// </summary>
    [Column("failed_login_attempts")]
    public int? FailedLoginAttempts { get; set; }

    /// <summary>
    /// Время до которого аккаунт заблокирован (если есть).
    /// </summary>
    [Column("locked_until", TypeName = "timestamp")]
    public DateTime? LockedUntil { get; set; }

    /// <summary>
    /// Роли пользователя (через сущность UserRole).
    /// </summary>
    [InverseProperty(nameof(UserRole.User))]
    public required ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    /// <summary>
    /// Записи паролей пользователя.
    /// </summary>
    public required ICollection<Password> Passwords { get; set; } = new List<Password>();

    /// <summary>
    /// Бронирования, созданные пользователем.
    /// </summary>
    [InverseProperty(nameof(Booking.User))]
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    /// <summary>
    /// Отзывы, оставленные пользователем (как автор).
    /// </summary>
    [InverseProperty(nameof(Review.Author))]
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    /// <summary>
    /// Судна, принадлежащие пользователю.
    /// </summary>
    [InverseProperty(nameof(Ship.Owner))]
    public ICollection<Ship> Ships { get; set; } = new List<Ship>();

    /// <summary>
    /// Календарные записи/рейсы, связанные с пользователем.
    /// </summary>
    [InverseProperty(nameof(Calendar.Owner))]
    public ICollection<Calendar> Calendars { get; set; } = new List<Calendar>();
}
