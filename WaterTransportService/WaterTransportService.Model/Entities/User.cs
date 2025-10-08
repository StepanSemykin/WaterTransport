namespace WaterTransportService.Model.Entities;

/// <summary>
/// Основная сущность пользователя.
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// Первичный GUID-идентификатор пользователя.
    /// </summary>
    public required Guid Uuid { get; set; }

    /// <summary>
    /// Профиль пользователя (1:1 связь).
    /// </summary>
    public required virtual UserProfile Profile { get; set; }

    /// <summary>
    /// Номер телефона пользователя.
    /// </summary>
    public required string Phone { get; set; }

    /// <summary>
    /// Никнейм пользователя.
    /// </summary>
    public required string Nickname { get; set; }

    /// <summary>
    /// Описание/биография пользователя.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Время создания аккаунта в UTC (переопределяет BaseEntity.CreatedAt при необходимости).
    /// </summary>
    public new DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Время последнего входа пользователя в UTC.
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Флаг активности аккаунта.
    /// </summary>
    public new bool IsActive { get; set; }

    /// <summary>
    /// Счётчик неудачных попыток входа.
    /// </summary>
    public int FailedLoginAttempts { get; set; }

    /// <summary>
    /// Время до которого аккаунт заблокирован (если есть).
    /// </summary>
    public DateTime? LockedUntil { get; set; }

    /// <summary>
    /// Роли пользователя.
    /// </summary>
    public required ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    /// <summary>
    /// Записи паролей пользователя (история хешей и версий алгоритма).
    /// </summary>
    public virtual ICollection<Password> Passwords { get; set; } = new List<Password>();

    /// <summary>
    /// Бронирования, созданные пользователем.
    /// </summary>
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    /// <summary>
    /// Отзывы, оставленные пользователем.
    /// </summary>
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    /// <summary>
    /// Судна, принадлежащие пользователю.
    /// </summary>
    public virtual ICollection<Ship> Ships { get; set; } = new List<Ship>();

    /// <summary>
    /// Календарные записи/рейсы, связанные с пользователем.
    /// </summary>
    public virtual ICollection<Calendar> Calendars { get; set; } = new List<Calendar>();
}
