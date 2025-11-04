using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Ports;

/// <summary>
/// Интерфейс сервиса для работы с портами.
/// </summary>
public interface IPortService
{
    /// <summary>
    /// Получить список всех портов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком портов и общим количеством.</returns>
    Task<(IReadOnlyList<PortDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    
    /// <summary>
    /// Получить порт по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор порта.</param>
    /// <returns>DTO порта или null, если не найден.</returns>
    Task<PortDto?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Создать новый порт.
    /// </summary>
    /// <param name="dto">Данные для создания порта.</param>
    /// <returns>Созданный порт или null при ошибке.</returns>
    Task<PortDto?> CreateAsync(CreatePortDto dto);
    
    /// <summary>
    /// Обновить существующий порт.
    /// </summary>
    /// <param name="id">Идентификатор порта.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный порт или null при ошибке.</returns>
    Task<PortDto?> UpdateAsync(Guid id, UpdatePortDto dto);
    
    /// <summary>
    /// Удалить порт.
    /// </summary>
    /// <param name="id">Идентификатор порта.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    Task<bool> DeleteAsync(Guid id);
}
