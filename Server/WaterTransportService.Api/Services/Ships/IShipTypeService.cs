using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ships;

public interface IShipTypeService
{
    Task<(IReadOnlyList<ShipTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<ShipTypeDto?> GetByIdAsync(ushort id, CancellationToken ct);
    Task<ShipTypeDto?> CreateAsync(CreateShipTypeDto dto, CancellationToken ct);
    Task<ShipTypeDto?> UpdateAsync(ushort id, UpdateShipTypeDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(ushort id, CancellationToken ct);
}
