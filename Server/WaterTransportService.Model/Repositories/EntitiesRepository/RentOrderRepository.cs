using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с заказами аренды.
/// </summary>
public class RentOrderRepository(WaterTransportDbContext context) : IEntityRepository<RentOrder, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все заказы аренды.
    /// </summary>
    /// <returns>Коллекция заказов аренды.</returns>
    public async Task<IEnumerable<RentOrder>> GetAllAsync() => await _context.RentOrders.ToListAsync();

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор заказа аренды.</param>
    /// <returns>Заказ аренды или null, если не найден.</returns>
    public async Task<RentOrder?> GetByIdAsync(Guid id) => await _context.RentOrders.FindAsync(id);

    /// <summary>
    /// Создать новый заказ аренды.
    /// </summary>
    /// <param name="entity">Сущность заказа для создания.</param>
    /// <returns>Созданная сущность заказа.</returns>
    public async Task<RentOrder> CreateAsync(RentOrder entity)
    {
        _context.RentOrders.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить заказ аренды.
    /// </summary>
    /// <param name="entity">Сущность с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого заказа.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(RentOrder entity, Guid id)
    {
        var old = await _context.RentOrders.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить заказ аренды.
    /// </summary>
    /// <param name="id">Идентификатор заказа для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RentOrders.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Получить заказы по статусам с включением связанных данных.
    /// </summary>
    /// <param name="statuses">Список статусов для фильтрации.</param>
    /// <returns>Коллекция заказов с указанными статусами.</returns>
    public async Task<IEnumerable<RentOrder>> GetByStatusesAsync(params string[] statuses)
    {
        return await _context.RentOrders
            .Include(ro => ro.ShipType)
            .Include(ro => ro.DeparturePort)
            .Include(ro => ro.ArrivalPort)
            .Include(ro => ro.Offers)
            .Where(ro => statuses.Contains(ro.Status))
            .ToListAsync();
    }

    /// <summary>
    /// Получить заказы по статусам с включением связанных данных. + c фильтром по пользователям.
    /// </summary>
    /// <param name="statuses">Список статусов для фильтрации.</param>
    /// <param name="id">Id пользователя </param>
    /// <returns>Коллекция заказов с указанными статусами.</returns>
    public async Task<IEnumerable<RentOrder>> GetForUserByStatusesAsync(Guid id, params string[] statuses)
    {
        return await _context.RentOrders
            .Include(ro => ro.ShipType)
            .Include(ro => ro.DeparturePort)
            .Include(ro => ro.ArrivalPort)
            .Include(ro => ro.Offers)
            .Where(ro => statuses.Contains(ro.Status))
            .Where(ro => ro.UserId == id)
            .ToListAsync();
    }

    /// <summary>
    /// Получить заказ с откликами по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор заказа.</param>
    /// <returns>Заказ с откликами или null.</returns>
    public async Task<RentOrder?> GetByIdWithOffersAsync(Guid id)
    {
        return await _context.RentOrders
            .Include(ro => ro.Offers)
            .FirstOrDefaultAsync(ro => ro.Id == id);
    }
}
