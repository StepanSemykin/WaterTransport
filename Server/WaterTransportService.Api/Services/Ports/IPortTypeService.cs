using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ports;

/// <summary>
/// Интерфейс сервиса для работы с типами портов.
/// </summary>
public interface IPortTypeService
{
    /// <summary>
    /// Получить список всех типов портов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком типов портов и общим количеством.</returns>
    Task<(IReadOnlyList<PortTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// Получить тип порта по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор типа порта.</param>
    /// <returns>DTO типа порта или null, если не найден.</returns>
    Task<PortTypeDto?> GetByIdAsync(ushort id);

    /// <summary>
    /// Создать новый тип порта.
    /// </summary>
    /// <param name="dto">Данные для создания типа порта.</param>
    /// <returns>Созданный тип порта или null при ошибке.</returns>
    Task<PortTypeDto?> CreateAsync(CreatePortTypeDto dto);

    /// <summary>
    /// Обновить существующий тип порта.
    /// </summary>
    /// <param name="id">Идентификатор типа порта.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный тип порта или null при ошибке.</returns>
    Task<PortTypeDto?> UpdateAsync(ushort id, UpdatePortTypeDto dto);

    /// <summary>
    /// Удалить тип порта.
    /// </summary>
    /// <param name="id">Идентификатор типа порта.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    Task<bool> DeleteAsync(ushort id);
}
