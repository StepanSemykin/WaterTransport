namespace WaterTransportService.Api.Services.Auth;

public interface ITokenService
{
    string GenerateAccessToken(string phone, string role, Guid userId);
    string GenerateRefreshToken();
    Task<string?> ValidateRefreshTokenAsync(Guid userId, string refreshToken);
    Task SaveRefreshTokenAsync(Guid userId, string refreshToken, DateTime expiresAt);
    Task RevokeRefreshTokenAsync(Guid userId);
}
