using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
namespace WaterTransportService.Api.Controllers.Rent;

/// <summary>
/// ���������� ��� ���������� �������� ������.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RentOrdersController(IRentOrderService service) : ControllerBase
{
    private readonly IRentOrderService _service = service;

    /// <summary>
    /// �������� ������ ���� ������� ������ � ����������.
    /// </summary>
    /// <param name="page">����� �������� (�� ��������� 1).</param>
    /// <param name="pageSize">���������� ��������� �� �������� (�� ��������� 20, �������� 100).</param>
    /// <returns>������ ������� ������ � ����������� � ���������.</returns>
    /// <response code="200">������� ������� ������ ������� ������.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// �������� ����� ������ �� ��������������.
    /// </summary>
    /// <param name="id">���������� ������������� ������ ������.</param>
    /// <returns>������ ������ ������.</returns>
    /// <response code="200">����� ������ ������� ������.</response>
    /// <response code="404">����� ������ �� ������.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RentOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentOrderDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// �������� ��������� ������ ��� �������� (� ����������� �� �����, ���� ����� � �����������).
    /// </summary>
    /// <param name="partnerId">������������� ��������.</param>
    /// <returns>������ ��������� ������� ��� ��������.</returns>
    /// <response code="200">������ ������� �������.</response>
    [HttpGet("available-for-partner/{partnerId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<RentOrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RentOrderDto>>> GetAvailableForPartner(Guid partnerId)
    {
        var orders = await _service.GetAvailableOrdersForPartnerAsync(partnerId);
        return Ok(orders);
    }

    /// <summary>
    /// ������� ����� ����� ������.
    /// </summary>
    /// <param name="dto">������ ��� �������� ������ ������.</param>
    /// <returns>��������� ����� ������.</returns>
    /// <response code="201">����� ������ ������� ������.</response>
    /// <response code="400">������������ ������.</response>
    [HttpPost]
    [ProducesResponseType(typeof(RentOrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize]
    public async Task<ActionResult<RentOrderDto>> Create([FromBody] CreateRentOrderDto dto)
    {
        // Получаем userId из ClaimsPrincipal, который заполняется JwtBearer middleware (предпочтительный способ)
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            // Возвращаем 401, если пользователя нет в claims или id невалиден
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var created = await _service.CreateAsync(dto, userGuid);
        return created is null
            ? BadRequest("Unable to create order. Check user, ports, and ship type.")
            : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// �������� ������������ ����� ������.
    /// </summary>
    /// <param name="id">���������� ������������� ������ ������.</param>
    /// <param name="dto">������ ��� ����������.</param>
    /// <returns>����������� ����� ������.</returns>
    /// <response code="200">����� ������ ������� ��������.</response>
    /// <response code="404">����� ������ �� ������.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(RentOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentOrderDto>> Update(Guid id, [FromBody] UpdateRentOrderDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// ��������� ������ (������������ ������������ ����������).
    /// </summary>
    /// <param name="id">������������� ������ ������.</param>
    /// <returns>NoContent ��� ������.</returns>
    /// <response code="204">������ ������� ���������.</response>
    /// <response code="400">���������� ��������� ������.</response>
    [HttpPost("{id:guid}/complete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CompleteOrder(Guid id)
    {
        var ok = await _service.CompleteOrderAsync(id);
        return ok ? NoContent() : BadRequest("Unable to complete order. Check order status.");
    }

    /// <summary>
    /// �������� ����� ������.
    /// </summary>
    /// <param name="id">������������� ������ ������.</param>
    /// <returns>NoContent ��� ������.</returns>
    /// <response code="204">����� ������� �������.</response>
    /// <response code="404">����� �� ������.</response>
    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var ok = await _service.CancelOrderAsync(id);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>
    /// ������� ����� ������.
    /// </summary>
    /// <param name="id">���������� ������������� ������ ������.</param>
    /// <returns>��������� ��������.</returns>
    /// <response code="204">����� ������ ������� ������.</response>
    /// <response code="404">����� ������ �� ������.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
