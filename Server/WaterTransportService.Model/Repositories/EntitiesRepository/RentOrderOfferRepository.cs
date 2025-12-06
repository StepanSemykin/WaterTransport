using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Репозиторий для работы с откликами партнеров на заказы аренды.
/// </summary>
public class RentOrderOfferRepository(WaterTransportDbContext context) : IEntityRepository<RentOrderOffer, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// Получить все отклики.
    /// </summary>
    /// <returns>Коллекция всех откликов.</returns>
    public async Task<IEnumerable<RentOrderOffer>> GetAllAsync() =>
        await _context.RentOrderOffers
            .Include(o => o.Partner)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Include(o => o.RentOrder)
            .ToListAsync();

    /// <summary>
    /// Получить отклик по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>Отклик или null, если не найден.</returns>
    public async Task<RentOrderOffer?> GetByIdAsync(Guid id) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Include(o => o.RentOrder)
            .FirstOrDefaultAsync(o => o.Id == id);

    /// <summary>
    /// Получить отклик с полными связанными данными по идентификатору.
    /// </summary>
    public async Task<RentOrderOffer?> GetByIdWithDetailsAsync(Guid id) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .FirstOrDefaultAsync(o => o.Id == id);

    /// <summary>
    /// Получить все отклики для конкретного заказа с полными данными.
    /// </summary>
    public async Task<IEnumerable<RentOrderOffer>> GetByRentOrderIdWithDetailsAsync(Guid rentOrderId) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Where(o => o.RentOrderId == rentOrderId)
            .ToListAsync();

    /// <summary>
    /// Получить все отклики конкретного партнера с полными данными.
    /// </summary>
    public async Task<IEnumerable<RentOrderOffer>> GetByPartnerIdWithDetailsAsync(Guid partnerId) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Where(o => o.PartnerId == partnerId)
            .ToListAsync();

    /// <summary>
    /// Получить отклики для пользователя (на его заказы) с полными данными.
    /// </summary>
    public async Task<IEnumerable<RentOrderOffer>> GetOffersForUserOrdersWithDetailsAsync(Guid userId, string status) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Include(o => o.RentOrder)
            .Where(o => o.RentOrder.UserId == userId && o.Status == status)
            .ToListAsync();

    /// <summary>
    /// Создать новый отклик.
    /// </summary>
    /// <param name="entity">Отклик сущность для создания.</param>
    /// <returns>Созданный отклик.</returns>
    public async Task<RentOrderOffer> CreateAsync(RentOrderOffer entity)
    {
        _context.RentOrderOffers.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Обновить отклик.
    /// </summary>
    /// <param name="entity">Отклик с новыми данными.</param>
    /// <param name="id">Идентификатор обновляемого отклика.</param>
    /// <returns>True, если обновление прошло успешно.</returns>
    public async Task<bool> UpdateAsync(RentOrderOffer entity, Guid id)
    {
        var old = await _context.RentOrderOffers.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Удалить отклик.
    /// </summary>
    /// <param name="id">Идентификатор отклика для удаления.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RentOrderOffers.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Получить все отклики для конкретного заказа.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <returns>Коллекция откликов для заказа.</returns>
    public async Task<IEnumerable<RentOrderOffer>> GetByRentOrderIdAsync(Guid rentOrderId) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner)
            .ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Include(o => o.Ship)
            .ThenInclude(s => s.Port)
            .Where(o => o.RentOrderId == rentOrderId)
            .ToListAsync();

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Коллекция откликов партнера.</returns>
    public async Task<IEnumerable<RentOrderOffer>> GetByPartnerIdAsync(Guid partnerId) =>
        await _context.RentOrderOffers
            .Include(o => o.RentOrder)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Where(o => o.PartnerId == partnerId)
            .ToListAsync();

    /// <summary>
    /// Удалить все отклики для конкретного заказа аренды.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <returns>Количество удаленных откликов.</returns>
    public async Task<int> DeleteByRentOrderIdAsync(Guid rentOrderId)
    {
        var offers = await _context.RentOrderOffers
            .Where(o => o.RentOrderId == rentOrderId)
            .ToListAsync();

        if (offers.Count == 0) return 0;

        _context.RentOrderOffers.RemoveRange(offers);
        await _context.SaveChangesAsync();
        return offers.Count;
    }
}
