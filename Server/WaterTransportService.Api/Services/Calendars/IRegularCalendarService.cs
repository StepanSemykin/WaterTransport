using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Calendars;

public interface IRegularCalendarService
{
    Task<(IReadOnlyList<RegularCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<RegularCalendarDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<RegularCalendarDto?> CreateAsync(CreateRegularCalendarDto dto, CancellationToken ct);
    Task<RegularCalendarDto?> UpdateAsync(Guid id, UpdateRegularCalendarDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
