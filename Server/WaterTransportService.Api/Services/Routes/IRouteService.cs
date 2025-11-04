using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Routes;

/// <summary>
/// Интерфейс сервиса для работы с маршрутами.
/// </summary>
public interface IRouteService
{
    /// <summary>
    /// Получить список маршрутов с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<RouteDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить маршрут по идентификатору.
    /// </summary>
    Task<RouteDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый маршрут.
    /// </summary>
    Task<RouteDto?> CreateAsync(CreateRouteDto dto);

    /// <summary>
    /// Обновить существующий маршрут.
    /// </summary>
    Task<RouteDto?> UpdateAsync(Guid id, UpdateRouteDto dto);

    /// <summary>
    /// Удалить маршрут.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
