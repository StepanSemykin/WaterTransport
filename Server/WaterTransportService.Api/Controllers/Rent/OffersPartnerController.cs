using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Authentication.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;

namespace WaterTransportService.Api.Controllers.Rent;

/// <summary>
/// Контроллер для партнера - управление откликами на свои заказы.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = AppRoles.PartnerOrAdmin)]
public class OffersPartnerController(IRentOrderOfferService offerService) : ControllerBase
{
    private readonly IRentOrderOfferService _offerService = offerService;

    /// <summary>
    /// Получить все отклики конкретного партнера.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера (обязателен только для администратора).</param>
    /// <returns>Список откликов партнера.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RentOrderOfferDto>>> GetPartnerOffers([FromQuery] Guid? partnerId = null)
    {
        Guid effectivePartnerId;
        if (User.IsInRole(AppRoles.Admin))
        {
            if (!partnerId.HasValue)
            {
                return BadRequest("partnerId query parameter is required for admin requests.");
            }
            effectivePartnerId = partnerId.Value;
        }
        else
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out effectivePartnerId))
            {
                return Unauthorized(new { message = "User ID not found or invalid token" });
            }
        }

        var offers = await _offerService.GetOffersByPartnerIdAsync(effectivePartnerId);
        return Ok(offers);
    }

    /// <summary>
    /// Получить заказы партнера по статусу откликов.
    /// </summary>
    /// <param name="status">Статус заказа.</param>
    /// <returns>Список заказов, связанных с партнером.</returns>
    [HttpGet("offers/status={status}")]
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
