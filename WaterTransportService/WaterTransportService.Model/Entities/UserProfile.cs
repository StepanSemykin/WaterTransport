using System.Text.Json.Serialization;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Расширенный профиль пользователя с дополнительными метаданными.
/// </summary>
public class UserProfile : BaseEntity
{
    /// <summary>
    /// FK на User.Uuid (1:1 связь с сущностью User).
    /// </summary>
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public required virtual User User { get; set; }

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Фамилия пользователя.
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// Отчество пользователя.
    /// </summary>
    public string? Patronymic { get; set; }

    /// <summary>
    /// Адрес электронной почты в профиле (опционально).
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Дата рождения (опционально).
    /// </summary>
    public DateTime? Birthday { get; set; }

    /// <summary>
    /// Коллекция изображений пользователя.
    /// </summary>
    public ICollection<UserImage> Images { get; set; } = [];

    /// <summary>
    /// Краткое описание/о себе.
    /// </summary>
    public string? About { get; set; }

    /// <summary>
    /// Местоположение (город/страна).
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// Публичный флаг видимости профиля.
    /// </summary>
    public bool IsPublic { get; set; } = true;

    /// <summary>
    /// Время последнего обновления профиля в UTC.
    /// </summary>
    public new DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Полное имя, вычисляемое из фамилии, имени и отчества.
    /// </summary>
    [JsonIgnore]
    public string FullName =>
        string.Join(' ', new[] { LastName, FirstName, Patronymic }.Where(s => !string.IsNullOrWhiteSpace(s)));

    /// <summary>
    /// Отображаемое имя: сначала полное имя, иначе никнейм пользователя.
    /// </summary>
    [JsonIgnore]
    public string DisplayName => !string.IsNullOrWhiteSpace(FullName) ? FullName : User?.Nickname ?? string.Empty;
}
