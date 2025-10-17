using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Сущность, представляющая хеш пароля пользователя и версию алгоритма.
/// </summary>
[Table("passwords")]
public class Password
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
    /// Соль, используемая при хешировании пароля.
    /// </summary>
    [Column("salt")]
    [Required]
    public required string Salt { get; set; }

    /// <summary>
    /// Хеш пароля.
    /// </summary>
    [Column("hash")]
    [Required]
    public required string Hash { get; set; }

    /// <summary>
    /// Версия/флаг алгоритма хеширования.
    /// </summary>
    [Column("version")]
    [Required]
    public required bool Version { get; set; }
}
