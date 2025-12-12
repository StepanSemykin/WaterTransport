using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Интерфейс репозитория для работы с отзывами.
/// </summary>
public interface IReviewRepository : IEntityRepository<Review, Guid>
{
    /// <summary>
    /// Получить все активные отзывы с пагинацией.
    /// </summary>
    /// <param name="skip">Количество записей для пропуска.</param>
    /// <param name="take">Количество записей для получения.</param>
    /// <returns>Коллекция активных отзывов.</returns>
    public Task<IEnumerable<Review>> GetAllActiveAsync(int skip, int take);

    /// <summary>
    /// Получить количество активных отзывов.
    /// </summary>
    /// <returns>Количество активных отзывов.</returns>
    public Task<int> GetActiveCountAsync();

    /// <summary>
    /// Получить все отзывы о пользователе-партнере.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Коллекция отзывов о пользователе.</returns>
    public Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId);

    /// <summary>
    /// Получить все отзывы о судне.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Коллекция отзывов о судне.</returns>
    public Task<IEnumerable<Review>> GetReviewsByShipIdAsync(Guid shipId);

    /// <summary>
    /// Получить все отзывы о порте.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Коллекция отзывов о порте.</returns>
    public Task<IEnumerable<Review>> GetReviewsByPortIdAsync(Guid portId);

    /// <summary>
    /// Получить средний рейтинг пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    public Task<(float Average, int Count)> GetAverageRatingForUserAsync(Guid userId);

    /// <summary>
    /// Получить средний рейтинг судна.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    public Task<(float Average, int Count)> GetAverageRatingForShipAsync(Guid shipId);

    /// <summary>
    /// Получить средний рейтинг порта.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    public Task<(float Average, int Count)> GetAverageRatingForPortAsync(Guid portId);
}
