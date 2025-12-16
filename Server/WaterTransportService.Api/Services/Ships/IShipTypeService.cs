using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ships;

/// <summary>
/// Интерфейс сервиса для работы с типами кораблей.
/// </summary>
public interface IShipTypeService
{
    /// <summary>
    /// Получить список всех типов кораблей с пагинацией.
    /// </summary>
    Task<(IReadOnlyList<ShipTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить тип корабля по идентификатору.
    /// </summary>
    Task<ShipTypeDto?> GetByIdAsync(ushort id);

    /// <summary>
    /// Создать новый тип корабля.
    /// </summary>
    Task<ShipTypeDto?> CreateAsync(CreateShipTypeDto dto);

    /// <summary>
    /// Обновить существующий тип корабля.
    /// </summary>
    Task<ShipTypeDto?> UpdateAsync(ushort id, UpdateShipTypeDto dto);

    /// <summary>
    /// Удалить тип корабля.
    /// </summary>
    Task<bool> DeleteAsync(ushort id);
}
