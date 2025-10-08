namespace WaterTransportService.Model.Entities;

/// <summary>
/// Отзыв пользователя о пользователе/судне.
/// </summary>
public class Review : BaseEntity
{
    /// <summary>
    /// Идентификатор отзыва.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// GUID автора отзыва.
    /// </summary>
    public required Guid AuthorUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на автора.
    /// </summary>
    public required virtual User Author { get; set; }

    /// <summary>
    /// GUID пользователя, к которому относится отзыв (если отзыв о пользователе).
    /// </summary>
    public Guid? UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на пользователя, к которому относится отзыв.
    /// </summary>
    public User? User { get; set; }

    /// <summary>
    /// Идентификатор судна, к которому относится отзыв (если отзыв о судне).
    /// </summary>
    public Guid? ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>
    public Ship? Ship { get; set; }

    /// <summary>
    /// Текст отзыва.
    /// </summary>
    public string? Comment { get; set; }

    /// <summary>
    /// Рейтинг от 0 до 5.
    /// </summary>
    public required uint Rating { get; set; } // от 0 до 5

    /// <summary>
    /// Время создания отзыва в UTC.
    /// </summary>
    public new required DateTime CreatedAt { get; set; }    
}
