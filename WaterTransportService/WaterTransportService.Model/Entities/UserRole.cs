namespace WaterTransportService.Model.Entities;

/// <summary>
/// Связующая сущность для связи многие-ко-многим между пользователями и ролями.
/// </summary>
public class UserRole : BaseEntity
{
    /// <summary>
    /// Идентификатор записи связки.
    /// </summary>
    public required uint Id { get; set; }

    /// <summary>
    /// GUID пользователя (внешний ключ на User.Uuid).
    /// </summary>
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Идентификатор роли (внешний ключ на Role.Id).
    /// </summary>
    public required ushort RoleId { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public required virtual User User { get; set; } = null!;

    /// <summary>
    /// Навигационное свойство на роль.
    /// </summary>
    public required virtual Role Role { get; set; } = null!;
}
