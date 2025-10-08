namespace WaterTransportService.Model.Entities;

/// <summary>
/// Сущность, представляющая хеш пароля пользователя.
/// </summary>
public class Password
{
    /// <summary>
    /// Идентификатор записи пароля.
    /// </summary>
    public required uint Id { get; set; }

    /// <summary>
    /// GUID пользователя-владельца пароля.
    /// </summary>
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя-владельца пароля.
    /// </summary>
    public required virtual User User { get; set; }

    /// <summary>
    /// Соль, используемая при хешировании пароля.
    /// </summary>
    public required string Salt { get; set; }

    /// <summary>
    /// Хеш пароля.
    /// </summary>
    public required string Hash { get; set; }

    /// <summary>
    /// Версия пароля.
    /// </summary>
    public required bool Version { get; set; }
}
