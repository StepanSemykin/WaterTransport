using Microsoft.AspNetCore.Mvc;
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
    /// <returns>Список заказов аренды с информацией о пагинации.</returns>
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
    /// Создать новый заказ аренды.
    /// </summary>
    /// <param name="dto">Данные для создания заказа аренды.</param>
    /// <returns>Созданный заказ аренды.</returns>
    /// <response code="201">Заказ аренды успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(RentOrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RentOrderDto>> Create([FromBody] CreateRentOrderDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
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
    /// Удалить заказ аренды.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа аренды.</param>
    /// <returns>Результат удаления.</returns>
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
