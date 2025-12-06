using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

public record ReviewDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    Guid? UserId,
    Guid? ShipId,
    Guid? PortId,
    Guid? RentOrderId,
    string? Comment,
    byte Rating,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    bool IsActive
);

public class CreateReviewDto
{
    /// <summary>
    /// Идентификатор пользователя, на которого оставляется отзыв (партнер).
    /// Обязателен только для отзывов на партнеров.
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Идентификатор судна, на которое оставляется отзыв.
    /// Обязателен только для отзывов на суда.
    /// </summary>
    public Guid? ShipId { get; set; }

    /// <summary>
    /// Идентификатор порта, на который оставляется отзыв.
    /// Обязателен только для отзывов на порты.
    /// </summary>
    public Guid? PortId { get; set; }

    /// <summary>
    /// Идентификатор заказа аренды.
    /// Обязателен для отзывов на партнеров и суда.
    /// </summary>
    public Guid? RentOrderId { get; set; }

    /// <summary>
    /// Текст отзыва.
    /// </summary>
    [MaxLength(1000)]
    public string? Comment { get; set; }

    /// <summary>
    /// Рейтинг от 0 до 5.
    /// </summary>
    [Required, Range(0, 5)]
    public required byte Rating { get; set; }
}

public class UpdateReviewDto
{
    /// <summary>
    /// Обновленный текст отзыва.
    /// </summary>
    [MaxLength(1000)]
    public string? Comment { get; set; }

    /// <summary>
    /// Обновленный рейтинг от 0 до 5.
    /// </summary>
    [Range(0, 5)]
    public byte? Rating { get; set; }

    /// <summary>
    /// Флаг активности (для модерации администратором).
    /// </summary>
    public bool? IsActive { get; set; }
}

/// <summary>
/// DTO для получения среднего рейтинга сущности.
/// </summary>
public record AverageRatingDto(
    double AverageRating,
    int TotalReviews
);
