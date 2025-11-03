using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Reviews;

public interface IReviewService
{
    Task<(IReadOnlyList<ReviewDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<ReviewDto?> GetByIdAsync(Guid id);
    Task<ReviewDto?> CreateAsync(CreateReviewDto dto);
    Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto);
    Task<bool> DeleteAsync(Guid id);
}
