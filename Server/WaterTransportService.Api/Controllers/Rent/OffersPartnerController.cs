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

    /// <summary>
    /// Получить заказы партнера по кокретному статусу отклика.
    /// </summary>
    /// <param name="status">Статус отклика.</param>
    /// <returns>Список заказов, связанных с партнером.</returns>
    [HttpGet("offers/status={status}")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<RentOrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<RentOrderDto>>> GetPartnerOrdersByStatus(string status)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var offers = await _offerService.GetPartnerOrdersByStatusAsync(status, userGuid);
        if (offers == null)
        {
            return NotFound();
        }

        return Ok(offers);
    }
}
