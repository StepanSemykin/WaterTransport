using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Reviews;

public interface IReviewService
{
    Task<(IReadOnlyList<ReviewDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<ReviewDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<ReviewDto?> CreateAsync(CreateReviewDto dto, CancellationToken ct);
    Task<ReviewDto?> UpdateAsync(Guid id, UpdateReviewDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
