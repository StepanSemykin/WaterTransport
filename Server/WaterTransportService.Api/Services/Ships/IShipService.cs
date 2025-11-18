using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Api.Services.Ships;

/// <summary>
/// Интерфейс сервиса для работы с кораблями.
/// </summary>
public interface IShipService
{
    /// <summary>
    /// Получить список всех кораблей с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<Ship> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить корабль по идентификатору.
    /// </summary>
    Task<ShipDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Получить все суда пользователя.  
    /// </summary>
    Task<(IReadOnlyList<ShipDto> Items, int Total)> GetByUserAsync(Guid userId, int page, int pageSize);

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
