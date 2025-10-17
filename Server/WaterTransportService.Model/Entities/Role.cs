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
    [Key]
    [Column("id")]
    public required uint Id { get; set; }

    /// <summary>
    /// Название роли.
    /// </summary>
    [Required]
    [MaxLength(128)]
    [Column("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Список пользователей, имеющих данную роль.
    /// </summary>
    public ICollection<User> Users { get; set; } = [];
}
