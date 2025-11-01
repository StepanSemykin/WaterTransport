using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ports;

public interface IPortService
{
    Task<(IReadOnlyList<PortDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<PortDto?> GetByIdAsync(Guid id);
    Task<PortDto?> CreateAsync(CreatePortDto dto);
    Task<PortDto?> UpdateAsync(Guid id, UpdatePortDto dto);
    Task<bool> DeleteAsync(Guid id);
}
