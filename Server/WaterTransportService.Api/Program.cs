using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System.Reflection;
using WaterTransportService.Api.Repositories;
using WaterTransportService.Api.Services;
using WaterTransportService.Model.Context;

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
    var modelAsm = typeof(WaterTransportService.Model.Entities.User).Assembly;
    var xmlModel = Path.Combine(AppContext.BaseDirectory, $"{modelAsm.GetName().Name}.xml");
    if (File.Exists(xmlModel))
        options.IncludeXmlComments(xmlModel);
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();



