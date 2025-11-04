using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Auth;

/// <summary>
/// Сервис для генерации, валидации и отзывов JWT/refresh токенов.
/// </summary>
public class TokenService(
    IConfiguration config,
    IEntityRepository<RefreshToken, Guid> refreshTokenRepo) : ITokenService
{
    private readonly IConfiguration _config = config;
    private readonly IEntityRepository<RefreshToken, Guid> _refreshTokenRepo = refreshTokenRepo;

    /// <summary>
    /// Сгенерировать JWT access токен с набором claims.
    /// </summary>
    /// <param name="phone">Телефон пользователя.</param>
    /// <param name="role">Роль пользователя.</param>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Строка JWT access токена.</returns>
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

    /// <summary>
    /// Сгенерировать криптографически стойкий refresh токен.
    /// </summary>
    /// <returns>Строка refresh токена (Base64).</returns>
    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    /// <summary>
    /// Сохранить refresh токен пользователя (создать или обновить).
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Значение refresh токена.</param>
    /// <param name="expiresAt">Дата истечения токена.</param>
    public async Task SaveRefreshTokenAsync(Guid userId, string refreshToken, DateTime expiresAt)
    {
        RefreshToken? existingToken = null;

        if (_refreshTokenRepo is RefreshTokenRepository concreteRepo)
        {
            existingToken = await concreteRepo.GetByUserIdAsync(userId);
        }
        else
        {
            var allTokens = await _refreshTokenRepo.GetAllAsync();
            existingToken = allTokens.FirstOrDefault(t => t.UserId == userId);
        }

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

    /// <summary>
    /// Провалидировать refresh токен для пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="refreshToken">Проверяемый refresh токен.</param>
    /// <returns>Токен при валидности или null.</returns>
    public async Task<string?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        RefreshToken? storedToken = null;

        if (_refreshTokenRepo is RefreshTokenRepository concreteRepo)
        {
            storedToken = await concreteRepo.GetByUserIdAsync(userId);
        }
        else
        {
            var allTokens = await _refreshTokenRepo.GetAllAsync();
            storedToken = allTokens.FirstOrDefault(t => t.UserId == userId);
        }

        if (storedToken is null)
            return null;

        return storedToken.Token == refreshToken && storedToken.ExpiresAt > DateTime.UtcNow
            ? storedToken.Token
            : null;
    }

    /// <summary>
    /// Отозвать refresh токен пользователя (удалить запись).
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    public async Task RevokeRefreshTokenAsync(Guid userId)
    {
        RefreshToken? token = null;

        if (_refreshTokenRepo is RefreshTokenRepository concreteRepo)
        {
            token = await concreteRepo.GetByUserIdAsync(userId);
        }
        else
        {
            var allTokens = await _refreshTokenRepo.GetAllAsync();
            token = allTokens.FirstOrDefault(t => t.UserId == userId);
        }

        if (token != null)
        {
            await _refreshTokenRepo.DeleteAsync(token.Id);
        }
    }
}
