using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Сущность, представляющая старые хеш пароли пользователя.
/// </summary>
[Table("old_passwords")]
public class OldPassword
{
    /// <summary>
    /// Идентификатор записи пароля.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор пользователя, которому принадлежит пароль.
    /// </summary>
    [Column("user_id", TypeName = "uuid")]
    [Required]
    public required Guid UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public required User User { get; set; }

    /// <summary>
    /// Хеш пароля.
    /// </summary>
    [Column("hash")]
    [Required]
    public required string Hash { get; set; }

    /// <summary>
    /// Время добавления пароля в UTC.
    /// </summary>
    [Column("created_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
