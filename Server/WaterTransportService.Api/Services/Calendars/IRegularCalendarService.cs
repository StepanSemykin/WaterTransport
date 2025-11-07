using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Calendars;

/// <summary>
/// Интерфейс сервиса для работы с календарями регулярных рейсов.
/// </summary>
public interface IRegularCalendarService
{
    /// <summary>
    /// Получить список календарей с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<RegularCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить календарь по идентификатору.
    /// </summary>
    Task<RegularCalendarDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый календарь.
    /// </summary>
    Task<RegularCalendarDto?> CreateAsync(CreateRegularCalendarDto dto);

    /// <summary>
    /// Обновить существующий календарь.
    /// </summary>
    Task<RegularCalendarDto?> UpdateAsync(Guid id, UpdateRegularCalendarDto dto);

    /// <summary>
    /// Удалить календарь.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
