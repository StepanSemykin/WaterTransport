# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY WaterTransportService.Api/*.csproj ./WaterTransportService.Api/
COPY WaterTransportService.Authentication/*.csproj ./WaterTransportService.Authentication/
COPY WaterTransportService.Infrastructure/*.csproj ./WaterTransportService.Infrastructure/
COPY WaterTransportService.Model/*.csproj ./WaterTransportService.Model/

RUN dotnet restore WaterTransportService.Api/WaterTransportService.Api.csproj

# copy rest of sources
COPY . .

WORKDIR /src/WaterTransportService.Api
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
# Listen on port 80
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "WaterTransportService.Api.dll"]