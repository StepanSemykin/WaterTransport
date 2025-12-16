namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Базовый интерфейс репозитория для работы с сущностями.
/// </summary>
/// <typeparam name="T">Тип сущности.</typeparam>
/// <typeparam name="TId">Тип идентификатора сущности.</typeparam>
public interface IEntityRepository<T, TId>
{
    /// <summary>
    /// Получить все сущности.
    /// </summary>
    /// <returns>Коллекция всех сущностей.</returns>
    public Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Получить сущность по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор сущности.</param>
    /// <returns>Сущность или null, если не найдена.</returns>
    public Task<T?> GetByIdAsync(TId id);

    /// <summary>
    /// Создать новую сущность.
    /// </summary>
    /// <param name="entity">Сущность для создания.</param>
    /// <returns>Созданная сущность.</returns>
    public Task<T> CreateAsync(T entity);

    /// <summary>
    /// Обновить существующую сущность.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемой сущности.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public Task<bool> UpdateAsync(T entity, TId id);

    /// <summary>
    /// Удалить сущность.
    /// </summary>
    /// <param name="id">Идентификатор удаляемой сущности.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public Task<bool> DeleteAsync(TId id);
}
