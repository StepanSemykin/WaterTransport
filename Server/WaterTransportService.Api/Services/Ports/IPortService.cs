using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services;

public interface IPortService
{
    Task<(IReadOnlyList<PortDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<PortDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<PortDto?> CreateAsync(CreatePortDto dto, CancellationToken ct);
    Task<PortDto?> UpdateAsync(Guid id, UpdatePortDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
