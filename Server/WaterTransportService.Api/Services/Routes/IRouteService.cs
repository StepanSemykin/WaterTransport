using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Routes;

public interface IRouteService
{
    Task<(IReadOnlyList<RouteDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<RouteDto?> GetByIdAsync(Guid id);
    Task<RouteDto?> CreateAsync(CreateRouteDto dto);
    Task<RouteDto?> UpdateAsync(Guid id, UpdateRouteDto dto);
    Task<bool> DeleteAsync(Guid id);
}
