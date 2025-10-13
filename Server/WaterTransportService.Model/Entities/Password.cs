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
    /// GUID пользователя-владельца пароля.
    /// </summary>
    [Column("user_uuid", TypeName = "uuid")]
    [Required]
    public required Guid UserUuid { get; set; }
    
    /// <summary>
    
    /// </summary>
    [Column("salt")]
    public required string Salt { get; set; }

    /// <summary>
    /// Хеш пароля.
    /// </summary>
    [Column("hash")]
    [Required]
    public required string Hash { get; set; }

    /// <summary>
    /// Версия/флаг алгоритма хеширования. Используется для миграции хешей при смене алгоритма.
    /// </summary>
    [Column("version")]
    public required bool Version { get; set; }
}
