using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;
namespace WaterTransportService.Api.Controllers.Rent;

/// <summary>
/// Контроллер для управления заказами аренды.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RentOrdersController(IRentOrderService service) : ControllerBase
{
    private readonly IRentOrderService _service = service;

    /// <summary>
    /// Получить список всех заказов аренды с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список заказов аренды и информацию о пагинации.</returns>
    /// <response code="200">Успешно получен список заказов аренды.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа аренды.</param>
    /// <returns>Данные заказа аренды.</returns>
    /// <response code="200">Заказ аренды успешно найден.</response>
    /// <response code="404">Заказ аренды не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RentOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentOrderDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Получить доступные заказы для партнера с подходящими суднами.
    /// </summary>
    /// <param name="partnerId">Идентификатор партнера.</param>
    /// <returns>Список доступных заказов с подходящими суднами партнера.</returns>
    /// <response code="200">Список успешно получен.</response>
    [HttpGet("available-for-partner/{partnerId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<AvailableRentOrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AvailableRentOrderDto>>> GetAvailableForPartner(Guid partnerId)
    {
        var orders = await _service.GetAvailableOrdersForPartnerAsync(partnerId);
        return Ok(orders);
    }

    /// <summary>
    /// Получить заказы пользователя по статусу.
    /// </summary>
    /// <param name="status">С каким статусом хотим получить заказы</param>
    /// <returns>Созданный заказ аренды.</returns>
    /// <response code="200">Заказы успешно найдены</response>
    /// <response code="400">Неправильные данные.</response>
    [HttpGet("get-for-user-by-status/status={status}")]
    [ProducesResponseType(typeof(IEnumerable<RentOrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RentOrderDto>>> GetForUserByStatusAsync(string status)
    {
        // Получаем userId из ClaimsPrincipal, который заполняется JwtBearer middleware (предпочтительный способ)
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userGuid))
        {
            // Возвращаем 401, если пользователя нет в claims или id невалиден
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var orders = await _service.GetForUserByStatusAsync(status, userGuid);
        return orders is null
            ? BadRequest("Unable to create order. Check user, ports, and ship type.")
            : Ok(orders);
    }

    /// <summary>
    /// Создать новый заказ аренды.
    /// </summary>
    /// <param name="dto">Данные для создания заказа аренды.</param>
    /// <returns>Созданный заказ аренды.</returns>
    /// <response code="201">Заказ аренды успешно создан.</response>
    /// <response code="400">Неправильные данные.</response>
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
    /// Обновить существующий заказ аренды.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа аренды.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный заказ аренды.</returns>
    /// <response code="200">Заказ аренды успешно обновлен.</response>
    /// <response code="404">Заказ аренды не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(RentOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentOrderDto>> Update(Guid id, [FromBody] UpdateRentOrderDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Завершить аренду (пользователь подтверждает завершение).
    /// </summary>
    /// <param name="id">Идентификатор заказа аренды.</param>
    /// <returns>NoContent при успехе.</returns>
    /// <response code="204">Аренда успешно завершена.</response>
    /// <response code="400">Невозможно завершить аренду.</response>
    [HttpPost("{id:guid}/complete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CompleteOrder(Guid id)
    {
        var ok = await _service.CompleteOrderAsync(id);
        return ok ? NoContent() : BadRequest("Unable to complete order. Check order status.");
    }

    /// <summary>
    /// Отменить заказ аренды.
    /// </summary>
    /// <param name="id">Идентификатор заказа аренды.</param>
    /// <returns>NoContent при успехе.</returns>
    /// <response code="204">Заказ успешно отменен.</response>
    /// <response code="404">Заказ не найден.</response>
    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var ok = await _service.CancelOrderAsync(id);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>
    /// Удалить заказ аренды.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа аренды.</param>
    /// <returns>Результат операции.</returns>
    /// <response code="204">Заказ аренды успешно удален.</response>
    /// <response code="404">Заказ аренды не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
