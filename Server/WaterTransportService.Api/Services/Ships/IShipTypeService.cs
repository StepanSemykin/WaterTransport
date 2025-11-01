using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ships;

public interface IShipTypeService
{
    Task<(IReadOnlyList<ShipTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<ShipTypeDto?> GetByIdAsync(ushort id);
    Task<ShipTypeDto?> CreateAsync(CreateShipTypeDto dto);
    Task<ShipTypeDto?> UpdateAsync(ushort id, UpdateShipTypeDto dto);
    Task<bool> DeleteAsync(ushort id);
}
