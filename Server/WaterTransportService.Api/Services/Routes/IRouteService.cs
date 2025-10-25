using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Routes;

public interface IRouteService
{
    Task<(IReadOnlyList<RouteDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<RouteDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<RouteDto?> CreateAsync(CreateRouteDto dto, CancellationToken ct);
    Task<RouteDto?> UpdateAsync(Guid id, UpdateRouteDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
