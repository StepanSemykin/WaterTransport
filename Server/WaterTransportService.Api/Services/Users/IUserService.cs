using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services;

public interface IUserService
{
    Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<UserDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken ct);
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
