using WaterTransportService.Authentication.DTO;

namespace WaterTransportService.Authentication.Services;

public interface IAuthService
{
    Task<LoginResultDto?> LoginAsync(LoginDto dto);
    Task<RegisterResultDto?> RegisterAsync(RegisterDto dto);
    Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken);
    Task<bool> LogoutAsync(Guid userId);
}
