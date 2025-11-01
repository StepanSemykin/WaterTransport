using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

public interface IUserService
{
    Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<string> LoginAsync (LoginDto dto);
}
