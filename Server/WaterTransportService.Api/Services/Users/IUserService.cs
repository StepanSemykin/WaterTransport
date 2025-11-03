using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

public interface IUserService
{
    Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto);
    Task<bool> DeleteAsync(Guid id);
    
    // Методы аутентификации
    Task<LoginResponseDto?> RegisterAsync(RegisterDto dto);
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken);
    Task<bool> LogoutAsync(Guid userId);
}
