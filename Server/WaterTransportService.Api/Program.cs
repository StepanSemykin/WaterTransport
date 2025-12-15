using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using WaterTransportService.Api;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Middleware;
using WaterTransportService.Api.Services.Images;
using WaterTransportService.Api.Services.Orders;
using WaterTransportService.Api.Services.Ports;
using WaterTransportService.Api.Services.Reviews;
using WaterTransportService.Api.Services.Ships;
using WaterTransportService.Api.Services.Users;
using WaterTransportService.Authentication.Services;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Infrastructure.PasswordValidator;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;
using WaterTransportService.Model.SeedData;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o => o.AddPolicy("Spa",
    p => p.WithOrigins("http://localhost:3001")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()
));

// Configure Memory Cache with size limit
builder.Services.AddMemoryCache(options =>
{
    options.SizeLimit = 300 * 1024 * 1024;
    options.CompactionPercentage = 0.25; // Remove 25% when limit reached
    options.ExpirationScanFrequency = TimeSpan.FromMinutes(1);
});

builder.Configuration
       .SetBasePath(Directory.GetCurrentDirectory())
       .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
       .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
       .AddUserSecrets<Program>(optional: true)
       .AddEnvironmentVariables();

builder.Services.AddAuthorization();

// Read signing key from configuration
var raw = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(raw))
    throw new InvalidOperationException("Configuration 'Jwt:Key' is missing. Set a 256-bit secret via user-secrets or environment variable (Jwt__Key).");

byte[] keyBytes;
if (Convert.TryFromBase64String(raw, new Span<byte>(new byte[raw.Length]), out var bytesWritten))
{
    keyBytes = Convert.FromBase64String(raw);
}
else
{
    keyBytes = Encoding.UTF8.GetBytes(raw);
}
if (keyBytes.Length < 32)
    throw new InvalidOperationException("Jwt:Key is too short. Use at least 256-bit (32 bytes).");

var signingKey = new SymmetricSecurityKey(keyBytes);

var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = !string.IsNullOrWhiteSpace(issuer),
            ValidIssuer = issuer,
            ValidateAudience = !string.IsNullOrWhiteSpace(audience),
            ValidAudience = audience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["AuthToken"]; // read from cookie
                return Task.CompletedTask;
            }
        };
    });

//builder.Services.AddDbContext<WaterTransportDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

builder.Services.AddDbContext<WaterTransportDbContext>(
    (sp, opt) =>
    {
        var cfg = sp.GetRequiredService<IConfiguration>();
        opt.UseNpgsql(cfg.GetConnectionString("Postgres"));
    });

// Register global exception handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.IncludeXmlComments(Path.Combine(
        AppContext.BaseDirectory,
        $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"), true);
    var modelAsm = typeof(User).Assembly;
    var xmlModel = Path.Combine(AppContext.BaseDirectory, $"{modelAsm.GetName().Name}.xml");
    if (File.Exists(xmlModel))
        options.IncludeXmlComments(xmlModel);
});

// Repositories DI
builder.Services.AddScoped<IUserRepository<Guid>, UserRepository>();
builder.Services.AddScoped<IEntityRepository<OldPassword, Guid>, OldPasswordRepository>();
builder.Services.AddScoped<IEntityRepository<RefreshToken, Guid>, RefreshTokenRepository>();
builder.Services.AddScoped<IPortRepository<Guid>, PortRepository>();
builder.Services.AddScoped<IEntityRepository<PortType, ushort>, PortTypeRepository>();
builder.Services.AddScoped<IEntityRepository<ShipType, ushort>, ShipTypeRepository>();
builder.Services.AddScoped<IEntityRepository<Ship, Guid>, ShipRepository>();
builder.Services.AddScoped<ShipRepository>();
builder.Services.AddScoped<IEntityRepository<ShipImage, Guid>, ShipImageRepository>();
builder.Services.AddScoped<IEntityRepository<RentOrder, Guid>, RentOrderRepository>();
builder.Services.AddScoped<RentOrderRepository>();
builder.Services.AddScoped<ShipRentalCalendarRepository>();
builder.Services.AddScoped<IEntityRepository<ShipRentalCalendar, Guid>, ShipRentalCalendarRepository>();
builder.Services.AddScoped<RentOrderOfferRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IEntityRepository<Review, Guid>>(sp => sp.GetRequiredService<IReviewRepository>());
builder.Services.AddScoped<IEntityRepository<UserImage, Guid>, UserImageRepository>();
builder.Services.AddScoped<IEntityRepository<UserProfile, Guid>, UserProfileRepository>();
builder.Services.AddScoped<IEntityRepository<PortImage, Guid>, PortImageRepository>();

// Services DI
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPortService, PortService>();
builder.Services.AddScoped<IPortTypeService, PortTypeService>();
builder.Services.AddScoped<IShipTypeService, ShipTypeService>();
builder.Services.AddScoped<IShipService, ShipService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IPasswordValidator, PasswordValidator>();

// Cache Service
builder.Services.AddSingleton<WaterTransportService.Api.Caching.ICacheService, WaterTransportService.Api.Caching.CacheService>();

// Rent Order Services with Caching (Decorator Pattern)
builder.Services.AddScoped<RentOrderService>(); // Base service
builder.Services.AddScoped<IRentOrderService>(provider =>
{
    var baseService = provider.GetRequiredService<RentOrderService>();
    var cache = provider.GetRequiredService<WaterTransportService.Api.Caching.ICacheService>();
    return new CachedRentOrderService(baseService, cache);
});

// Rent Order Offer Services with Caching (Decorator Pattern)
builder.Services.AddScoped<RentOrderOfferService>(); // Base service
builder.Services.AddScoped<IRentOrderOfferService>(provider =>
{
    var baseService = provider.GetRequiredService<RentOrderOfferService>();
    var cache = provider.GetRequiredService<WaterTransportService.Api.Caching.ICacheService>();
    return new CachedRentOrderOfferService(baseService, cache);
});
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto>, UserImageService>();
builder.Services.AddScoped<IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto>, PortImageService>();
builder.Services.AddScoped<IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto>, ShipImageService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IPasswordValidator, PasswordValidator>();

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<Mapping>());

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var cfg = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var adminCs = cfg.GetConnectionString("PostgresAdmin");
    if (string.IsNullOrWhiteSpace(adminCs))
        throw new InvalidOperationException("Connection string 'PostgresAdmin' не найдена.");

    var options = new DbContextOptionsBuilder<WaterTransportDbContext>()
                  .UseNpgsql(adminCs)
                  .Options;

    await using var adminContext = new WaterTransportDbContext(options);
    await adminContext.Database.MigrateAsync();

    var adminPhone = cfg["AdminSettings:Phone"];
    var adminPwd = cfg["AdminSettings:Password"];
    if (!string.IsNullOrWhiteSpace(adminPhone) && !string.IsNullOrWhiteSpace(adminPwd))
    {
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var hash = hasher.Generate(adminPwd);
        await DatabaseSeeder.SeedAdminAsync(adminContext, hash, adminPhone);
    }
}


app.UseHttpsRedirection();
app.UseCors("Spa");

// Global exception handler
app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
