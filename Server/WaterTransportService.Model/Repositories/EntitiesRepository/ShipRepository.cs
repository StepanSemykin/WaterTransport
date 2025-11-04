using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для сущности корабля.
/// </summary>
public class ShipRepository(WaterTransportDbContext context) : IEntityRepository<Ship, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все корабли.
    /// </summary>
    public async Task<IEnumerable<Ship>> GetAllAsync() => await _context.Ships.ToListAsync();

    /// <summary>
    /// Получить корабль по идентификатору.
    /// </summary>
    public async Task<Ship?> GetByIdAsync(Guid id) => await _context.Ships.FindAsync(id);

    /// <summary>
    /// Создать новый корабль.
    /// </summary>
    public async Task<Ship> CreateAsync(Ship entity)
    {
        _context.Ships.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить корабль.
    /// </summary>
    public async Task<bool> UpdateAsync(Ship entity, Guid id)
    {
        var old = await _context.Ships.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить корабль.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.Ships.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
