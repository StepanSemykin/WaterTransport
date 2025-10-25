using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

public interface IRegularOrderService
{
    Task<(IReadOnlyList<RegularOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<RegularOrderDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<RegularOrderDto?> CreateAsync(CreateRegularOrderDto dto, CancellationToken ct);
    Task<RegularOrderDto?> UpdateAsync(Guid id, UpdateRegularOrderDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
