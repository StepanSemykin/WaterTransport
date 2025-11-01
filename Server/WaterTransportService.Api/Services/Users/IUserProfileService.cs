using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

public interface IUserProfileService
{
    Task<(IReadOnlyList<UserProfileDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<UserProfileDto?> GetByIdAsync(Guid id);
    Task<UserProfileDto?> CreateAsync(CreateUserProfileDto dto);
    Task<UserProfileDto?> UpdateAsync(Guid id, UpdateUserProfileDto dto);
    Task<bool> DeleteAsync(Guid id);
}
