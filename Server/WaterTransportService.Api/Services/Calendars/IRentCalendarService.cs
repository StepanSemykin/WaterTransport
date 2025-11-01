using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Calendars;

public interface IRentCalendarService
{
    Task<(IReadOnlyList<RentCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<RentCalendarDto?> GetByIdAsync(Guid id);
    Task<RentCalendarDto?> CreateAsync(CreateRentCalendarDto dto);
    Task<RentCalendarDto?> UpdateAsync(Guid id, UpdateRentCalendarDto dto);
    Task<bool> DeleteAsync(Guid id);
}
