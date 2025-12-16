using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Authentication.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;
namespace WaterTransportService.Api.Controllers.Rent;

/// <summary>
/// Контроллер для работы с откликами партнеров на заказы аренды.
/// </summary>
[ApiController]
[Route("api/rent-orders/[controller]")]
public class OffersController(IRentOrderOfferService offerService, IRentOrderService orderService) : ControllerBase
{
    private readonly IRentOrderOfferService _offerService = offerService;
    private readonly IRentOrderService _orderService = orderService;

    /// <summary>
    /// Получить все отклики для конкретного заказа аренды.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <returns>Список откликов.</returns>
    [HttpGet]
    [Authorize(Roles = AppRoles.CommonOrAdmin)]
    public async Task<ActionResult<IEnumerable<RentOrderOfferDto>>> GetOffersByRentOrder(Guid rentOrderId)
    {
        var offers = await _offerService.GetOffersByRentOrderIdAsync(rentOrderId);
        return Ok(offers);
    }

    /// <summary>
    /// Получить все отклики для конкретного пользователя.
    /// </summary>
    /// <returns>Список откликов.</returns>
    [HttpGet("foruser")]
    [Authorize(Roles = AppRoles.CommonOrAdmin)]
    public async Task<ActionResult<IEnumerable<RentOrderOfferDto>>> GetOffersByUser()
    {
        // Получаем userId из ClaimsPrincipal, который заполняется JwtBearer middleware (предпочтительный способ)
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            // Возвращаем 401, если пользователя нет в claims или id невалиден
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var offers = await _offerService.GetOffersByUser(userGuid);
        return Ok(offers);
    }

    /// <summary>
    /// Получить отклик по идентификатору.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <param name="id">Идентификатор отклика.</param>
    /// <returns>Отклик или NotFound.</returns>
    [HttpGet("{id}")]
    [Authorize(Roles = AppRoles.AnyAuthenticated)]
    public async Task<ActionResult<RentOrderOfferDto>> GetOfferById(Guid rentOrderId, Guid id)
    {
        var offer = await _offerService.GetOfferByIdAsync(id);
        if (offer is null || offer.RentOrderId != rentOrderId)
            return NotFound();
        return Ok(offer);
    }

    /// <summary>
    /// Создать новый отклик на заказ аренды (партнер откликается).
    /// </summary>
    /// <param name="dto">Данные для создания отклика.</param>
    /// <returns>Созданный отклик.</returns>
    [HttpPost]
    [Authorize(Roles = AppRoles.PartnerOrAdmin)]
    public async Task<ActionResult<RentOrderOfferDto>> CreateOffer([FromBody] CreateRentOrderOfferDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            // Возвращаем 401, если пользователя нет в claims или id невалиден
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var created = await _offerService.CreateOfferAsync(dto, userGuid);
        if (created is null)
            return BadRequest("Unable to create offer. Check order status, ship ownership, and requirements.");

        return CreatedAtAction(nameof(GetOfferById), new { rentOrderId = created.RentOrderId, id = created.Id }, created);
    }

    /// <summary>
    /// Принять отклик (пользователь выбирает партнера).
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <param name="id">Идентификатор принимаемого отклика.</param>
    /// <returns>NoContent при успехе.</returns>
    [HttpPost("{id}/accept")]
    [Authorize(Roles = AppRoles.CommonOrAdmin)]
    public async Task<ActionResult> AcceptOffer(Guid rentOrderId, Guid id)
    {
        // Проверка, что пользователь владеет заказом
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var order = await _orderService.GetByIdAsync(rentOrderId);
        if (order is null)
            return NotFound("Order not found");

        if (order.UserId != userGuid)
            return Forbid(); // 403 - пользователь не владеет этим заказом

        var result = await _offerService.AcceptOfferAsync(rentOrderId, id);
        if (!result)
            return BadRequest("Unable to accept offer. Check order and offer status.");

        return NoContent();
    }

    /// <summary>
    /// Отклонить отклик (пользователь отвергает партнера).
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <param name="id">Идентификатор отклика для отклонения.</param>
    /// <returns>NoContent при успехе.</returns>
    [HttpPost("{id}/reject")]
    [Authorize(Roles = AppRoles.CommonOrAdmin)]
    public async Task<ActionResult> RejectOffer(Guid rentOrderId, Guid id)
    {
        // Проверка, что пользователь владеет заказом
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var order = await _orderService.GetByIdAsync(rentOrderId);
        if (order is null)
            return NotFound("Order not found");

        if (order.UserId != userGuid)
            return Forbid();

        var offer = await _offerService.GetOfferByIdAsync(id);
        if (offer is null || offer.RentOrderId != rentOrderId)
            return NotFound();

        var result = await _offerService.RejectOfferAsync(id);
        if (!result)
            return BadRequest("Unable to reject offer. Check order and offer status.");

        return NoContent();
    }

    /// <summary>
    /// Удалить отклик.
    /// </summary>
    /// <param name="rentOrderId">Идентификатор заказа аренды.</param>
    /// <param name="id">Идентификатор отклика для удаления.</param>
    /// <returns>NoContent при успехе.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = AppRoles.PartnerOrAdmin)]
    public async Task<ActionResult> DeleteOffer(Guid rentOrderId, Guid id)
    {
        // Проверка прав: партнер может удалить только свой отклик
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var offer = await _offerService.GetOfferByIdAsync(id);
        if (offer is null || offer.RentOrderId != rentOrderId)
            return NotFound();

        if (offer.PartnerId != userGuid)
            return Forbid(); // Партнер может удалить только свой отклик

        var result = await _offerService.DeleteOfferAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
