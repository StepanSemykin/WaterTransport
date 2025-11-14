using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для типов судов.
/// </summary>
public class ShipTypeRepository(WaterTransportDbContext context) : IEntityRepository<ShipType, ushort>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все типы судов.
    /// </summary>
    public async Task<IEnumerable<ShipType>> GetAllAsync() => await _context.ShipTypes.ToListAsync();

    /// <summary>
    /// Получить тип судна по идентификатору.
    /// </summary>
    public async Task<ShipType?> GetByIdAsync(ushort id) => await _context.ShipTypes.FindAsync(id);

    /// <summary>
    /// Создать тип судна.
    /// </summary>
    public async Task<ShipType> CreateAsync(ShipType entity)
    {
        _context.ShipTypes.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить тип судна.
    /// </summary>
    public async Task<bool> UpdateAsync(ShipType entity, ushort id)
    {
        var old = await _context.ShipTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить тип судна.
    /// </summary>
    public async Task<bool> DeleteAsync(ushort id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.ShipTypes.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
