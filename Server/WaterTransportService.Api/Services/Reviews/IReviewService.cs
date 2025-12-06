using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Reviews;

/// <summary>
/// Интерфейс сервиса для работы с отзывами.
/// </summary>
public interface IReviewService
{
    /// <summary>
    /// Получить список всех отзывов с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<ReviewDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    Task<ReviewDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Получить все отзывы о конкретном пользователе-партнере.
    /// </summary>
    Task<IReadOnlyList<ReviewDto>> GetReviewsByUserIdAsync(Guid userId);

    /// <summary>
    /// Получить все отзывы о конкретном судне.
    /// </summary>
    Task<IReadOnlyList<ReviewDto>> GetReviewsByShipIdAsync(Guid shipId);

    /// <summary>
    /// Получить все отзывы о конкретном порте.
    /// </summary>
    Task<IReadOnlyList<ReviewDto>> GetReviewsByPortIdAsync(Guid portId);

    /// <summary>
    /// Получить средний рейтинг пользователя-партнера.
    /// </summary>
    Task<AverageRatingDto> GetAverageRatingForUserAsync(Guid userId);

    /// <summary>
    /// Получить средний рейтинг судна.
    /// </summary>
    Task<AverageRatingDto> GetAverageRatingForShipAsync(Guid shipId);

    /// <summary>
    /// Получить средний рейтинг порта.
    /// </summary>
    Task<AverageRatingDto> GetAverageRatingForPortAsync(Guid portId);

    /// <summary>
    /// Создать новый отзыв.
    /// </summary>
    Task<ReviewDto?> CreateAsync(CreateReviewDto dto, Guid authorId);

    /// <summary>
    /// Обновить существующий отзыв.
    /// </summary>
    Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto, Guid authorId);

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
