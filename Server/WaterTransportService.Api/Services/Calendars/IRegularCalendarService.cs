using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Calendars;

public interface IRegularCalendarService
{
    Task<(IReadOnlyList<RegularCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<RegularCalendarDto?> GetByIdAsync(Guid id);
    Task<RegularCalendarDto?> CreateAsync(CreateRegularCalendarDto dto);
    Task<RegularCalendarDto?> UpdateAsync(Guid id, UpdateRegularCalendarDto dto);
    Task<bool> DeleteAsync(Guid id);
}
