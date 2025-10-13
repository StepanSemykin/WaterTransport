namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Связующая сущность для связи многие-ко-многим между пользователями и ролями.
/// </summary>
[Table("user_roles")]
public class UserRole : BaseEntity
{
    /// <summary>
    /// Идентификатор записи связки.
    /// </summary>
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// GUID пользователя (внешний ключ на User.Uuid).
    /// </summary>
    [Column("user_uuid", TypeName = "uuid")]
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Идентификатор роли (внешний ключ на Role.Id).
    /// </summary>
    [Column("role_id")]
    public required ushort RoleId { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    [ForeignKey(nameof(UserUuid))]
    [InverseProperty(nameof(User.UserRoles))]
    public required virtual User User { get; set; } = null!;

    /// <summary>
    /// Навигационное свойство на роль.
    /// </summary>
    [ForeignKey(nameof(RoleId))]
    [InverseProperty(nameof(Role.UserRoles))]
    public required virtual Role Role { get; set; } = null!;
}
