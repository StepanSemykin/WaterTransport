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
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком маршрутов и общим количеством.</returns>
    Task<(IReadOnlyList<RouteDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить маршрут по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор маршрута.</param>
    /// <returns>DTO маршрута или null, если не найден.</returns>
    Task<RouteDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый маршрут.
    /// </summary>
    /// <param name="dto">Данные для создания маршрута.</param>
    /// <returns>Созданный маршрут или null при ошибке.</returns>
    Task<RouteDto?> CreateAsync(CreateRouteDto dto);

    /// <summary>
    /// Обновить существующий маршрут.
    /// </summary>
    /// <param name="id">Идентификатор маршрута.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный маршрут или null при ошибке.</returns>
    Task<RouteDto?> UpdateAsync(Guid id, UpdateRouteDto dto);

    /// <summary>
    /// Удалить маршрут.
    /// </summary>
    /// <param name="id">Идентификатор маршрута.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    Task<bool> DeleteAsync(Guid id);
}
