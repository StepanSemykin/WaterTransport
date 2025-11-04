using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с refresh токенами.
/// </summary>
public class RefreshTokenRepository(WaterTransportDbContext context) : IEntityRepository<RefreshToken, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Создать новый refresh токен.
    /// </summary>
    /// <param name="entity">Сущность refresh токена.</param>
    /// <returns>Созданный refresh токен.</returns>
    public async Task<RefreshToken> CreateAsync(RefreshToken entity)
    {
        _context.RefreshTokens.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Получить все refresh токены.
    /// </summary>
    /// <returns>Коллекция refresh токенов.</returns>
    public async Task<IEnumerable<RefreshToken>> GetAllAsync() => await _context.RefreshTokens.ToListAsync();

    /// <summary>
    /// Получить refresh токен по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор refresh токена.</param>
    /// <returns>Сущность или null, если не найдена.</returns>
    public async Task<RefreshToken?> GetByIdAsync(Guid id) => await _context.RefreshTokens.FindAsync(id);

    /// <summary>
    /// Обновить refresh токен.
    /// </summary>
    /// <param name="entity">Новые данные.</param>
    /// <param name="id">Идентификатор обновляемого токена.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(RefreshToken entity, Guid id)
    {
        var old = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить refresh токен.
    /// </summary>
    /// <param name="id">Идентификатор токена.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RefreshTokens.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
