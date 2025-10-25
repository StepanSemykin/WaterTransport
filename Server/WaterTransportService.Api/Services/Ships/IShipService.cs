using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ships;

public interface IShipService
{
    Task<(IReadOnlyList<ShipDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<ShipDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<ShipDto?> CreateAsync(CreateShipDto dto, CancellationToken ct);
    Task<ShipDto?> UpdateAsync(Guid id, UpdateShipDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
