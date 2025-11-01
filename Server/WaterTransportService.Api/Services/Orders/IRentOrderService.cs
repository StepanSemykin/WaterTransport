using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

public interface IRentOrderService
{
    Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<RentOrderDto?> GetByIdAsync(Guid id);
    Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto);
    Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto);
    Task<bool> DeleteAsync(Guid id);
}
