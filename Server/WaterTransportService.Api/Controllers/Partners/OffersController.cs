using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;

namespace WaterTransportService.Api.Controllers.Partners;

/// <summary>
/// Контроллер для партнеров - управление откликами на заказы аренды.
/// </summary>
[ApiController]
[Route("api/partners/{partnerId}/[controller]")]
public class OffersController(IRentOrderOfferService offerService) : ControllerBase
{
    private readonly IRentOrderOfferService _offerService = offerService;

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Список откликов партнера.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RentOrderOfferDto>>> GetPartnerOffers(Guid partnerId)
    {
        var offers = await _offerService.GetOffersByPartnerIdAsync(partnerId);
        return Ok(offers);
    }
}
