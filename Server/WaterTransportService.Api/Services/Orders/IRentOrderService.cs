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
    /// Получить список всех заказов аренды пользотля о статусу.
    /// </summary>
    Task<IEnumerable<RentOrderDto>> GetForUserByStatusAsync(string status, Guid id);

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    Task<RentOrderDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Получить доступные заказы для партнера с подходящими суднами.
    /// </summary>
    Task<IEnumerable<AvailableRentOrderDto>> GetAvailableOrdersForPartnerAsync(Guid partnerId);

    /// <summary>
    /// Создать новый заказ аренды.
    /// </summary>
    Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto, Guid userId);

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

