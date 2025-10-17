using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;

var builder = WebApplication.CreateBuilder(args);


builder.Configuration
       .SetBasePath(Directory.GetCurrentDirectory())
       .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
       .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
       .AddEnvironmentVariables();

builder.Services.AddDbContext<WaterTransportDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

var app = builder.Build();
app.Run();
