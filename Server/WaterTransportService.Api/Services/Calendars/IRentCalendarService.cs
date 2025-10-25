using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Calendars;

public interface IRentCalendarService
{
    Task<(IReadOnlyList<RentCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<RentCalendarDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<RentCalendarDto?> CreateAsync(CreateRentCalendarDto dto, CancellationToken ct);
    Task<RentCalendarDto?> UpdateAsync(Guid id, UpdateRentCalendarDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
