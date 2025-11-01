using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ports;

public interface IPortTypeService
{
    Task<(IReadOnlyList<PortTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<PortTypeDto?> GetByIdAsync(ushort id);
    Task<PortTypeDto?> CreateAsync(CreatePortTypeDto dto);
    Task<PortTypeDto?> UpdateAsync(ushort id, UpdatePortTypeDto dto);
    Task<bool> DeleteAsync(ushort id);
}
