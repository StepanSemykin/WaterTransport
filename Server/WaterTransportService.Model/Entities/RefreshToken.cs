using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

/// <summary>
/// Refresh токен для обновления access токена.
/// </summary>
[Table("refresh_tokens")]
public class RefreshToken
{
    /// <summary>
    /// Идентификатор токена.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    [Column("user_id", TypeName = "uuid")]
    [Required]
    public required Guid UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя.
    /// </summary>
    public User? User { get; set; }

    /// <summary>
    /// Значение refresh токена.
    /// </summary>
    [Column("token")]
    [Required]
    [MaxLength(256)]
    public required string Token { get; set; }

    /// <summary>
    /// Время истечения токена (UTC).
    /// </summary>
    [Column("expires_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Время создания токена (UTC).
    /// </summary>
    [Column("created_at", TypeName = "timestamptz")]
    [Required]
    public required DateTime CreatedAt { get; set; }
}
