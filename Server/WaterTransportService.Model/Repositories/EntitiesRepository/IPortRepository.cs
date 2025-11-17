using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

public interface IPortRepository<Id>
{
    /// <summary>
    /// Получить все порты.
    /// </summary>
    public Task<IEnumerable<Port>> GetAllAsync();

    /// <summary>
    /// Получить порт по идентификатору.
    /// </summary>
    public Task<Port?> GetByIdAsync(Id id);

    /// <summary>
    /// Получить порт по названию.
    /// </summary>
    public Task<Port?> GetByTitleAsync(string title);

    /// <summary>
    /// Создать порт.
    /// </summary>
    public Task<Port> CreateAsync(Port port);

    /// <summary>
    /// Обновить порт.
    /// </summary>
    public Task<bool> UpdateAsync(Port port, Id id);

    /// <summary>
    /// Удалить порт.
    /// </summary>
    public Task<bool> DeleteAsync(Id id);
}