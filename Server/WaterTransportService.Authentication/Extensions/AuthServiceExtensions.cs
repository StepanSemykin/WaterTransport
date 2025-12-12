using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WaterTransportService.Authentication.Services;

namespace WaterTransportService.Authentication.Extensions;

public static class AuthServiceExtensions
{
    public static IServiceCollection AddAuthenticationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();

        var jwtSettings = configuration.GetSection("Jwt");
        var key = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key not configured");

        SymmetricSecurityKey signingKey;
        try
        {
            var keyBytes = Convert.FromBase64String(key);
            signingKey = new SymmetricSecurityKey(keyBytes);
        }
        catch
        {
            signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        }

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = signingKey,
                ClockSkew = TimeSpan.Zero
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    if (context.Request.Cookies.ContainsKey("AuthToken"))
                    {
                        context.Token = context.Request.Cookies["AuthToken"];
                    }
                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }
}
