using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Auth;
using WaterTransportService.Api.Services.Calendars;
using WaterTransportService.Api.Services.Images;
using WaterTransportService.Api.Services.Orders;
using WaterTransportService.Api.Services.Ports;
using WaterTransportService.Api.Services.Reviews;
using WaterTransportService.Api.Services.Routes;
using WaterTransportService.Api.Services.Ships;
using WaterTransportService.Api.Services.Users;
using WaterTransportService.Infrastructure.FileStorage;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o => o.AddPolicy("Spa",
    p => p.WithOrigins("http://localhost:3001" )
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()
));

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

builder.Services.AddDbContext<WaterTransportDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

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
builder.Services.AddScoped<IEntityRepository<Port, Guid>, PortRepository>();
builder.Services.AddScoped<IEntityRepository<PortType, ushort>, PortTypeRepository>();
builder.Services.AddScoped<IEntityRepository<ShipType, ushort>, ShipTypeRepository>();
builder.Services.AddScoped<IEntityRepository<Ship, Guid>, ShipRepository>();
builder.Services.AddScoped<ShipRepository>();
builder.Services.AddScoped<IEntityRepository<ShipImage, Guid>, ShipImageRepository>();
builder.Services.AddScoped<IEntityRepository<WaterTransportService.Model.Entities.Route, Guid>, RouteRepository>();
builder.Services.AddScoped<IEntityRepository<RegularCalendar, Guid>, RegularCalendarRepository>();
builder.Services.AddScoped<IEntityRepository<RegularOrder, Guid>, RegularOrderRepository>();
builder.Services.AddScoped<IEntityRepository<RentOrder, Guid>, RentOrderRepository>();
builder.Services.AddScoped<RentOrderRepository>();
builder.Services.AddScoped<RentOrderOfferRepository>();
builder.Services.AddScoped<IEntityRepository<Review, Guid>, ReviewRepository>();
builder.Services.AddScoped<IEntityRepository<UserImage, Guid>, UserImageRepository>();
builder.Services.AddScoped<IEntityRepository<UserProfile, Guid>, UserProfileRepository>();
builder.Services.AddScoped<IEntityRepository<PortImage, Guid>, PortImageRepository>();

// Services DI
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPortService, PortService>();
builder.Services.AddScoped<IPortTypeService, PortTypeService>();
builder.Services.AddScoped<IShipTypeService, ShipTypeService>();
builder.Services.AddScoped<IShipService, ShipService>();
builder.Services.AddScoped<IRouteService, RouteService>();
builder.Services.AddScoped<IRegularCalendarService, RegularCalendarService>();
builder.Services.AddScoped<IRegularOrderService, RegularOrderService>();
builder.Services.AddScoped<IRentOrderService, RentOrderService>();
builder.Services.AddScoped<IRentOrderOfferService, RentOrderOfferService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto>, UserImageService>();
builder.Services.AddScoped<IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto>, PortImageService>();
builder.Services.AddScoped<IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto>, ShipImageService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("Spa");


app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None, // ����� ��� cross-site
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

SameSiteMode SameSitePolicy() => app.Environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.Strict;

