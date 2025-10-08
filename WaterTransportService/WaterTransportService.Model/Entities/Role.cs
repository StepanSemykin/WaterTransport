namespace WaterTransportService.Model.Entities;

/// <summary>
/// Роль пользователя в системе.
/// </summary>
public class Role
{
    /// <summary>
    /// Идентификатор роли.
    /// </summary>
    public required ushort Id { get; set; }

    /// <summary>
    /// Название роли.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Связи с пользователями через таблицу UserRole (many-to-many).
    /// </summary>
    public required ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
