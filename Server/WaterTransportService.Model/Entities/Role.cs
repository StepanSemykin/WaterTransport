using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Роль пользователя в системе.
/// </summary>
[Table("roles")]
public class Role
{
    /// <summary>
    /// Идентификатор роли.
    /// </summary>
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Название роли.
    /// </summary>
    [Required]
    [MaxLength(128)]
    public required string Name { get; set; }

    /// <summary>
    /// Связи с пользователями через таблицу UserRole (many-to-many).
    /// </summary>
    public required ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
