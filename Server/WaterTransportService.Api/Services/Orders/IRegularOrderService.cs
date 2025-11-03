using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

public interface IRegularOrderService
{
    Task<(IReadOnlyList<RegularOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<RegularOrderDto?> GetByIdAsync(Guid id);
    Task<RegularOrderDto?> CreateAsync(CreateRegularOrderDto dto);
    Task<RegularOrderDto?> UpdateAsync(Guid id, UpdateRegularOrderDto dto);
    Task<bool> DeleteAsync(Guid id);
}
