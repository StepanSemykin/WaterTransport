using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Calendars;

/// <summary>
/// Интерфейс сервиса для работы с календарями аренды.
/// </summary>
public interface IRentCalendarService
{
    /// <summary>
    /// Получить список календарей аренды с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<RentCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить календарь аренды по идентификатору.
    /// </summary>
    Task<RentCalendarDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый календарь аренды.
    /// </summary>
    Task<RentCalendarDto?> CreateAsync(CreateRentCalendarDto dto);

    /// <summary>
    /// Обновить существующий календарь аренды.
    /// </summary>
    Task<RentCalendarDto?> UpdateAsync(Guid id, UpdateRentCalendarDto dto);

    /// <summary>
    /// Удалить календарь аренды.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
