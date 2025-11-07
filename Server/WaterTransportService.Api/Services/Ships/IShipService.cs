using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ships;

/// <summary>
/// Интерфейс сервиса для работы с кораблями.
/// </summary>
public interface IShipService
{
    /// <summary>
    /// Получить список всех кораблей с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<ShipDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить корабль по идентификатору.
    /// </summary>
    Task<ShipDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Создать новый корабль.
    /// </summary>
    Task<ShipDto?> CreateAsync(CreateShipDto dto);

    /// <summary>
    /// Обновить существующий корабль.
    /// </summary>
    Task<ShipDto?> UpdateAsync(Guid id, UpdateShipDto dto);

    /// <summary>
    /// Удалить корабль.
    /// </summary>
    Task<bool> DeleteAsync(Guid id);
}
