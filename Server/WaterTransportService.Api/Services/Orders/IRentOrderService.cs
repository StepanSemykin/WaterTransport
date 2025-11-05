using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Интерфейс сервиса для управления заказами аренды.
/// </summary>
public interface IRentOrderService
{
    /// <summary>
    /// Получить список всех заказов аренды с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    Task<RentOrderDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Получить доступные заказы для партнеров (фильтрация по порту и типу судна).
    /// </summary>
    Task<IEnumerable<RentOrderDto>> GetAvailableOrdersForPartnerAsync(Guid partnerId);

    /// <summary>
    /// Создать новый заказ аренды.
    /// </summary>
    Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto);

    /// <summary>
    /// Обновить существующий заказ аренды.
    /// </summary>
    Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto);

    /// <summary>
    /// Завершить аренду (пользователь подтверждает завершение).
    /// </summary>
    Task<bool> CompleteOrderAsync(Guid id);

    /// <summary>
    /// Отменить заказ аренды.
    /// </summary>
    Task<bool> CancelOrderAsync(Guid id);

    /// <summary>
    /// Удалить заказ аренды.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
