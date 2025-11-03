using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Auth;

public class TokenService(
    IConfiguration config,
    IEntityRepository<RefreshToken, Guid> refreshTokenRepo) : ITokenService
{
    private readonly IConfiguration _config = config;
    private readonly IEntityRepository<RefreshToken, Guid> _refreshTokenRepo = refreshTokenRepo;

    public string GenerateAccessToken(string phone, string role, Guid userId)
    {
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];
        var keyStr = _config["Jwt:Key"] ?? string.Empty;
        var expMinutes = _config.GetValue<int?>("Jwt:ExpirationMinutes") ?? 60;

        Claim[] claims =
        [
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new("userId", userId.ToString()),
            new("phone", phone),
            new("role", role),
            new(ClaimTypes.Role, role)
        ];

        SymmetricSecurityKey key;
        try
        {
            var keyBytes = Convert.FromBase64String(keyStr);
            key = new SymmetricSecurityKey(keyBytes);
        }
        catch
        {
            key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(keyStr));
        }

        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expMinutes),
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public async Task SaveRefreshTokenAsync(Guid userId, string refreshToken, DateTime expiresAt)
    {
        var allTokens = await _refreshTokenRepo.GetAllAsync();
        var existingToken = allTokens.FirstOrDefault(t => t.UserId == userId);

        if (existingToken != null)
        {
            existingToken.Token = refreshToken;
            existingToken.ExpiresAt = expiresAt;
            existingToken.CreatedAt = DateTime.UtcNow;
            await _refreshTokenRepo.UpdateAsync(existingToken, existingToken.Id);
        }
        else
        {
            var newToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Token = refreshToken,
                ExpiresAt = expiresAt,
                CreatedAt = DateTime.UtcNow
            };
            await _refreshTokenRepo.CreateAsync(newToken);
        }
    }

    public async Task<string?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var allTokens = await _refreshTokenRepo.GetAllAsync();
        var storedToken = allTokens.FirstOrDefault(t =>
            t.UserId == userId &&
            t.Token == refreshToken &&
            t.ExpiresAt > DateTime.UtcNow);

        return storedToken?.Token;
    }

    public async Task RevokeRefreshTokenAsync(Guid userId)
    {
        var allTokens = await _refreshTokenRepo.GetAllAsync();
        var token = allTokens.FirstOrDefault(t => t.UserId == userId);

        if (token != null)
        {
            await _refreshTokenRepo.DeleteAsync(token.Id);
        }
    }
}
