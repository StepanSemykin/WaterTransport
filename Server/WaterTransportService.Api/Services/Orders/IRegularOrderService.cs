using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Интерфейс сервиса для управления заказами регулярных рейсов.
/// </summary>
public interface IRegularOrderService
{
    /// <summary>
    /// Получить список всех заказов с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<RegularOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить заказ по идентификатору.
    /// </summary>
    Task<RegularOrderDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый заказ.
    /// </summary>
    Task<RegularOrderDto?> CreateAsync(CreateRegularOrderDto dto);

    /// <summary>
    /// Обновить существующий заказ.
    /// </summary>
    Task<RegularOrderDto?> UpdateAsync(Guid id, UpdateRegularOrderDto dto);

    /// <summary>
    /// Удалить заказ.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
