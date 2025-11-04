using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для типов портов.
/// </summary>
public class PortTypeRepository(WaterTransportDbContext context) : IEntityRepository<PortType, ushort>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все типы портов.
    /// </summary>
    public async Task<IEnumerable<PortType>> GetAllAsync() => await _context.PortTypes.ToListAsync();

    /// <summary>
    /// Получить тип порта по идентификатору.
    /// </summary>
    public async Task<PortType?> GetByIdAsync(ushort id) => await _context.PortTypes.FindAsync(id);

    /// <summary>
    /// Создать тип порта.
    /// </summary>
    public async Task<PortType> CreateAsync(PortType entity)
    {
        _context.PortTypes.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить тип порта.
    /// </summary>
    public async Task<bool> UpdateAsync(PortType entity, ushort id)
    {
        var old = await _context.PortTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить тип порта.
    /// </summary>
    public async Task<bool> DeleteAsync(ushort id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.PortTypes.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }
}
