using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Интерфейс репозитория для работы с пользователями.
/// </summary>
/// <typeparam name="Id">Тип идентификатора пользователя.</typeparam>
public interface IUserRepository<Id>
{
    /// <summary>
    /// Получить всех пользователей.
    /// </summary>
    public Task<IEnumerable<User>> GetAllAsync();

    /// <summary>
    /// Получить пользователя по идентификатору.
    /// </summary>
    public Task<User?> GetByIdAsync(Id id);

    /// <summary>
    /// Получить пользователя по номеру телефона.
    /// </summary>
    public Task<User?> GetByPhoneAsync(string phone);

    /// <summary>
    /// Создать пользователя.
    /// </summary>
    public Task<User> CreateAsync(User user);

    /// <summary>
    /// Обновить пользователя.
    /// </summary>
    public Task<bool> UpdateAsync(User user, Id id);

    /// <summary>
    /// Удалить пользователя.
    /// </summary>
    public Task<bool> DeleteAsync(Id id);
}
