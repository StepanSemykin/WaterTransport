using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;

namespace WaterTransportService.Api.Controllers.Rent;

/// <summary>
/// Контроллер для партнёров - управление откликами на заказы аренды.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class OffersPartnerController(IRentOrderOfferService offerService) : ControllerBase
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

    [HttpGet("offers/status={status}")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RentOrderDto>>> GetPendingPartnerOffers(string status)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var offers = await _offerService.GetPendingOffersByPartnerIdAsync(status, userGuid);

        return Ok(offers);
    }




}
