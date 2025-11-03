using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Calendars;
using WaterTransportService.Api.Services.Images;
using WaterTransportService.Api.Services.Orders;
using WaterTransportService.Api.Services.Ports;
using WaterTransportService.Api.Services.Reviews;
using WaterTransportService.Api.Services.Routes;
using WaterTransportService.Api.Services.Ships;
using WaterTransportService.Api.Services.Users;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
       .SetBasePath(Directory.GetCurrentDirectory())
       .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
       .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
       .AddEnvironmentVariables();

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
builder.Services.AddScoped<IEntityRepository<User, Guid>, UserRepository>();
builder.Services.AddScoped<IEntityRepository<OldPassword, Guid>, OldPasswordRepository>();
builder.Services.AddScoped<IEntityRepository<Port, Guid>, PortRepository>();
builder.Services.AddScoped<IEntityRepository<PortType, ushort>, PortTypeRepository>();
builder.Services.AddScoped<IEntityRepository<ShipType, ushort>, ShipTypeRepository>();
builder.Services.AddScoped<IEntityRepository<Ship, Guid>, ShipRepository>();
builder.Services.AddScoped<IEntityRepository<ShipImage, Guid>, ShipImageRepository>();
builder.Services.AddScoped<IEntityRepository<WaterTransportService.Model.Entities.Route, Guid>, RouteRepository>();
builder.Services.AddScoped<IEntityRepository<RegularCalendar, Guid>, RegularCalendarRepository>();
builder.Services.AddScoped<IEntityRepository<RegularOrder, Guid>, RegularOrderRepository>();
builder.Services.AddScoped<IEntityRepository<RentCalendar, Guid>, RentCalendarRepository>();
builder.Services.AddScoped<IEntityRepository<RentOrder, Guid>, RentOrderRepository>();
builder.Services.AddScoped<IEntityRepository<Review, Guid>, ReviewRepository>();
builder.Services.AddScoped<IEntityRepository<UserImage, Guid>, UserImageRepository>();
builder.Services.AddScoped<IEntityRepository<UserProfile, Guid>, UserProfileRepository>();
builder.Services.AddScoped<IEntityRepository<PortImage, Guid>, PortImageRepository>();

// Services DI
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPortService, PortService>();
builder.Services.AddScoped<IPortTypeService, PortTypeService>();
builder.Services.AddScoped<IShipTypeService, ShipTypeService>();
builder.Services.AddScoped<IShipService, ShipService>();
builder.Services.AddScoped<IRouteService, RouteService>();
builder.Services.AddScoped<IRegularCalendarService, RegularCalendarService>();
builder.Services.AddScoped<IRegularOrderService, RegularOrderService>();
builder.Services.AddScoped<IRentCalendarService, RentCalendarService>();
builder.Services.AddScoped<IRentOrderService, RentOrderService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto>, UserImageService>();
builder.Services.AddScoped<IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto>, PortImageService>();
builder.Services.AddScoped<IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto>, ShipImageService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
