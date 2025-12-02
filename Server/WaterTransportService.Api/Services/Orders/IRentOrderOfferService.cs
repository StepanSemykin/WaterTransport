using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Интерфейс сервиса для работы с откликами партнеров на заказы аренды.
/// </summary>
public interface IRentOrderOfferService
{
    /// <summary>
    /// Получить все отклики для конкретного заказа.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <returns>Коллекция откликов.</returns>
    Task<IEnumerable<RentOrderOfferDto>> GetOffersByRentOrderIdAsync(Guid rentOrderId);

    /// <summary>
    /// Получить все отклики для конкретного для всех заказов пользователя.
    /// </summary>
    /// <returns>Коллекция откликов партнера.</returns>
    Task<IEnumerable<RentOrderOfferDto>> GetOffersByUser(Guid userId);

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Коллекция откликов партнера.</returns>
    Task<IEnumerable<RentOrderOfferDto>> GetOffersByPartnerIdAsync(Guid partnerId);

    /// <summary>
    /// Получить отклик по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>Отклик или null.</returns>
    Task<RentOrderOfferDto?> GetOfferByIdAsync(Guid id);

    /// <summary>
    /// Создать новый отклик партнера на заказ.
    /// </summary>
    /// <param name="createDto">Данные для создания отклика.</param>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Созданный отклик.</returns>
    Task<RentOrderOfferDto?> CreateOfferAsync(CreateRentOrderOfferDto createDto, Guid partnerId);

    /// <summary>
    /// Принять отклик партнера (пользователь выбирает партнера).
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <param name="offerId">Идентификатор принимаемого отклика.</param>
    /// <returns>True, если операция успешна.</returns>
    Task<bool> AcceptOfferAsync(Guid rentOrderId, Guid offerId);

    /// <summary>
    /// Удалить отклик.
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>True, если удаление успешно.</returns>
    Task<bool> DeleteOfferAsync(Guid id);

    /// <summary>
    /// Отклонить отклик.
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>True, если отклонение успешно.</returns>
    Task<bool> RejectOfferAsync(Guid id);
}
