using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

public interface IUserProfileService
{
    Task<(IReadOnlyList<UserProfileDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<UserProfileDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<UserProfileDto?> CreateAsync(CreateUserProfileDto dto, CancellationToken ct);
    Task<UserProfileDto?> UpdateAsync(Guid id, UpdateUserProfileDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
