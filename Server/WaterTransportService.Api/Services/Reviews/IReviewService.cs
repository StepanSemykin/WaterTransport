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
    /// Создать новый отзыв.
    /// </summary>
    Task<ReviewDto?> CreateAsync(CreateReviewDto dto);

    /// <summary>
    /// Обновить отзыв.
    /// </summary>
    Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto);

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
