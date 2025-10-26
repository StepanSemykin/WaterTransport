using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ports;

public interface IPortTypeService
{
    Task<(IReadOnlyList<PortTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<PortTypeDto?> GetByIdAsync(ushort id, CancellationToken ct);
    Task<PortTypeDto?> CreateAsync(CreatePortTypeDto dto, CancellationToken ct);
    Task<PortTypeDto?> UpdateAsync(ushort id, UpdatePortTypeDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(ushort id, CancellationToken ct);
}
