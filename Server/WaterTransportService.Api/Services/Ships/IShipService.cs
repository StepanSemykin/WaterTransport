using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ships;

public interface IShipService
{
    Task<(IReadOnlyList<ShipDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<ShipDto?> GetByIdAsync(Guid id);
    Task<ShipDto?> CreateAsync(CreateShipDto dto);
    Task<ShipDto?> UpdateAsync(Guid id, UpdateShipDto dto);
    Task<bool> DeleteAsync(Guid id);
}
