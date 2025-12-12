ï»¿using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Repositories.EntitiesRepository;

/// <summary>
/// Ð ÐµÐ¿Ð¾Ð·Ð¸ÑÐ¾ÑÐ¸Ð¹ Ð´Ð»Ñ ÑÐ°Ð±Ð¾ÑÑ Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð¼Ð¸ Ð¿Ð°ÑÑÐ½ÐµÑÐ¾Ð² Ð½Ð° Ð·Ð°ÐºÐ°Ð·Ñ Ð°ÑÐµÐ½Ð´Ñ.
/// </summary>
public class RentOrderOfferRepository(WaterTransportDbContext context) : IEntityRepository<RentOrderOffer, Guid>
{
    private readonly WaterTransportDbContext _context = context;

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸.
    /// </summary>
    /// <returns>ÐÐ¾Ð»Ð»ÐµÐºÑÐ¸Ñ Ð²ÑÐµÑ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð².</returns>
    public async Task<IEnumerable<RentOrderOffer>> GetAllAsync() =>
        await _context.RentOrderOffers
            .Include(o => o.Partner)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Include(o => o.RentOrder)
            .ToListAsync();

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð¾ÑÐºÐ»Ð¸Ðº Ð¿Ð¾ Ð¸Ð´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾ÑÑ.
    /// </summary>
    /// <param name="id">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ°.</param>
    /// <returns>ÐÑÐºÐ»Ð¸Ðº Ð¸Ð»Ð¸ null, ÐµÑÐ»Ð¸ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½.</returns>
    public async Task<RentOrderOffer?> GetByIdAsync(Guid id) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Include(o => o.RentOrder)
            .FirstOrDefaultAsync(o => o.Id == id);

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð¾ÑÐºÐ»Ð¸Ðº Ñ Ð¿Ð¾Ð»Ð½ÑÐ¼Ð¸ ÑÐ²ÑÐ·Ð°Ð½Ð½ÑÐ¼Ð¸ Ð´Ð°Ð½Ð½ÑÐ¼Ð¸ Ð¿Ð¾ Ð¸Ð´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾ÑÑ.
    /// </summary>
    public async Task<RentOrderOffer?> GetByIdWithDetailsAsync(Guid id) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .FirstOrDefaultAsync(o => o.Id == id);

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð´Ð»Ñ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ Ð·Ð°ÐºÐ°Ð·Ð° Ñ Ð¿Ð¾Ð»Ð½ÑÐ¼Ð¸ Ð´Ð°Ð½Ð½ÑÐ¼Ð¸.
    /// </summary>
    public async Task<IEnumerable<RentOrderOffer>> GetByRentOrderIdWithDetailsAsync(Guid rentOrderId) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Where(o => o.RentOrderId == rentOrderId)
            .ToListAsync();

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ Ð¿Ð°ÑÑÐ½ÐµÑÐ° Ñ Ð¿Ð¾Ð»Ð½ÑÐ¼Ð¸ Ð´Ð°Ð½Ð½ÑÐ¼Ð¸.
    /// </summary>
    public async Task<IEnumerable<RentOrderOffer>> GetByPartnerIdWithDetailsAsync(Guid partnerId) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Where(o => o.PartnerId == partnerId)
            .ToListAsync();

    /// <summary>
    /// Ïîëó÷èòü îòêëèêè ñ îïðåäåëåííûì ñòàòóñîì.
    /// </summary>
    /// <returns>Ñïèñîê îòêëèêîâ.</returns>
    public async Task<IEnumerable<RentOrderOffer>> GetByStatusWithDetailsAsync(string status, Guid partnerId)
    {
        return await _context.RentOrderOffers
            .Include(o => o.Ship)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Where(o => o.Status == status && o.PartnerId == partnerId)
            .ToListAsync();
    }

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð´Ð»Ñ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ (Ð½Ð° ÐµÐ³Ð¾ Ð·Ð°ÐºÐ°Ð·Ñ) Ñ Ð¿Ð¾Ð»Ð½ÑÐ¼Ð¸ Ð´Ð°Ð½Ð½ÑÐ¼Ð¸.
    /// </summary>
    public async Task<IEnumerable<RentOrderOffer>> GetOffersForUserOrdersWithDetailsAsync(Guid userId, string status) =>
        await _context.RentOrderOffers
            .Include(o => o.Partner).ThenInclude(p => p.UserProfile)
            .Include(o => o.Ship).ThenInclude(s => s.ShipType)
            .Include(o => o.Ship).ThenInclude(s => s.ShipImages)
            .Include(o => o.Ship).ThenInclude(s => s.Reviews)
            .Include(o => o.RentOrder)
            .Where(o => o.RentOrder.UserId == userId && o.Status == status)
            .ToListAsync();

    /// <summary>
    /// Ð¡Ð¾Ð·Ð´Ð°ÑÑ Ð½Ð¾Ð²ÑÐ¹ Ð¾ÑÐºÐ»Ð¸Ðº.
    /// </summary>
    /// <param name="entity">ÐÑÐºÐ»Ð¸Ðº ÑÑÑÐ½Ð¾ÑÑÑ Ð´Ð»Ñ ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ñ.</param>
    /// <returns>Ð¡Ð¾Ð·Ð´Ð°Ð½Ð½ÑÐ¹ Ð¾ÑÐºÐ»Ð¸Ðº.</returns>
    public async Task<RentOrderOffer> CreateAsync(RentOrderOffer entity)
    {
        _context.RentOrderOffers.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// ÐÐ±Ð½Ð¾Ð²Ð¸ÑÑ Ð¾ÑÐºÐ»Ð¸Ðº.
    /// </summary>
    /// <param name="entity">ÐÑÐºÐ»Ð¸Ðº Ñ Ð½Ð¾Ð²ÑÐ¼Ð¸ Ð´Ð°Ð½Ð½ÑÐ¼Ð¸.</param>
    /// <param name="id">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÐ¼Ð¾Ð³Ð¾ Ð¾ÑÐºÐ»Ð¸ÐºÐ°.</param>
    /// <returns>True, ÐµÑÐ»Ð¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿ÑÐ¾ÑÐ»Ð¾ ÑÑÐ¿ÐµÑÐ½Ð¾.</returns>
    public async Task<bool> UpdateAsync(RentOrderOffer entity, Guid id)
    {
        var old = await _context.RentOrderOffers.FirstOrDefaultAsync(x => x.Id == id);
        if (old == null) return false;

        _context.Entry(old).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Ð£Ð´Ð°Ð»Ð¸ÑÑ Ð¾ÑÐºÐ»Ð¸Ðº.
    /// </summary>
    /// <param name="id">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ° Ð´Ð»Ñ ÑÐ´Ð°Ð»ÐµÐ½Ð¸Ñ.</param>
    /// <returns>True, ÐµÑÐ»Ð¸ ÑÐ´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¿ÑÐ¾ÑÐ»Ð¾ ÑÑÐ¿ÐµÑÐ½Ð¾.</returns>
    public async Task<bool> DeleteAsync(Guid id)
    {
        var old = await GetByIdAsync(id);
        if (old == null) return false;
        _context.RentOrderOffers.Remove(old);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð´Ð»Ñ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ Ð·Ð°ÐºÐ°Ð·Ð°.
    /// </summary>
    /// <param name="rentOrderId">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð·Ð°ÐºÐ°Ð·Ð° Ð°ÑÐµÐ½Ð´Ñ.</param>
    /// <returns>ÐÐ¾Ð»Ð»ÐµÐºÑÐ¸Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð´Ð»Ñ Ð·Ð°ÐºÐ°Ð·Ð°.</returns>
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
    /// ÐÐ¾Ð»ÑÑÐ¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ Ð¿Ð°ÑÑÐ½ÐµÑÐ°.
    /// </summary>
    /// <param name="partnerId">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð¿Ð°ÑÑÐ½ÐµÑÐ°.</param>
    /// <returns>ÐÐ¾Ð»Ð»ÐµÐºÑÐ¸Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð°ÑÑÐ½ÐµÑÐ°.</returns>
    public async Task<IEnumerable<RentOrderOffer>> GetByPartnerIdAsync(Guid partnerId) =>
        await _context.RentOrderOffers
            .Include(o => o.RentOrder)
            .Include(o => o.Ship)
            .ThenInclude(s => s.ShipType)
            .Where(o => o.PartnerId == partnerId)
            .ToListAsync();

    /// <summary>
    /// Ð£Ð´Ð°Ð»Ð¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð´Ð»Ñ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ Ð·Ð°ÐºÐ°Ð·Ð° Ð°ÑÐµÐ½Ð´Ñ.
    /// </summary>
    /// <param name="rentOrderId">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð·Ð°ÐºÐ°Ð·Ð° Ð°ÑÐµÐ½Ð´Ñ.</param>
    /// <returns>ÐÐ¾Ð»Ð¸ÑÐµÑÑÐ²Ð¾ ÑÐ´Ð°Ð»ÐµÐ½Ð½ÑÑ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð².</returns>
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

    /// <summary>
    /// ÐÐ¾Ð¼ÐµÑÐ¸ÑÑ Ð²ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð´Ð»Ñ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ Ð·Ð°ÐºÐ°Ð·Ð° Ð°ÑÐµÐ½Ð´Ñ ÐºÐ°Ðº Rejected.
    /// </summary>
    /// <param name="rentOrderId">ÐÐ´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ Ð·Ð°ÐºÐ°Ð·Ð° Ð°ÑÐµÐ½Ð´Ñ.</param>
    /// <returns>ÐÐ¾Ð»Ð¸ÑÐµÑÑÐ²Ð¾ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐ½Ð½ÑÑ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð².</returns>
    public async Task<int> RejectByRentOrderIdAsync(Guid rentOrderId)
    {
        var offers = await _context.RentOrderOffers
            .Where(o => o.RentOrderId == rentOrderId)
            .ToListAsync();

        if (offers.Count == 0) return 0;

        var now = DateTime.UtcNow;
        foreach (var offer in offers)
        {
            offer.Status = Constants.RentOrderOfferStatus.Rejected;
            offer.RespondedAt = now;
        }

        await _context.SaveChangesAsync();
        return offers.Count;
    }

}
