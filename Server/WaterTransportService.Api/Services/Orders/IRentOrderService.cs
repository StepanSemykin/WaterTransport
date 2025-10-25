using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

public interface IRentOrderService
{
    Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<RentOrderDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto, CancellationToken ct);
    Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
