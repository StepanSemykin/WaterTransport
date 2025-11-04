using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с изображениями пользователей.
/// </summary>
public class UserImageRepository(WaterTransportDbContext context) : IEntityRepository<UserImage, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все изображения пользователей.
    /// </summary>
    /// <returns>Коллекция изображений пользователей.</returns>
    public async Task<IEnumerable<UserImage>> GetAllAsync() => await _context.UserImages.ToListAsync();

    /// <summary>
    /// Получить изображение пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>Изображение пользователя или null, если не найдено.</returns>
    public async Task<UserImage?> GetByIdAsync(Guid id) => await _context.UserImages.FindAsync(id);

    /// <summary>
    /// Создать новое изображение пользователя.
    /// </summary>
    /// <param name="entity">Сущность изображения для создания.</param>
    /// <returns>Созданная сущность изображения.</returns>
    public async Task<UserImage> CreateAsync(UserImage entity)
    {
        _context.UserImages.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить изображение пользователя.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого изображения.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(UserImage entity, Guid id)
    {
        var old = await _context.UserImages.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        old.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить изображение пользователя.
    /// </summary>
    /// <param name="id">Идентификатор изображения для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.UserImages.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
