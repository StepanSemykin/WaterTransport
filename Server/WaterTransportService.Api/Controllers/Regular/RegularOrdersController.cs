using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Orders;

namespace WaterTransportService.Api.Controllers.Regular;

/// <summary>
/// Контроллер для управления заказами регулярных рейсов.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RegularOrdersController(IRegularOrderService service) : ControllerBase
{
    private readonly IRegularOrderService _service = service;

    /// <summary>
    /// Получить список всех заказов регулярных рейсов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список заказов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список заказов.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить заказ регулярного рейса по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа.</param>
    /// <returns>Данные заказа.</returns>
    /// <response code="200">Заказ успешно найден.</response>
    /// <response code="404">Заказ не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RegularOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RegularOrderDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый заказ регулярного рейса.
    /// </summary>
    /// <param name="dto">Данные для создания заказа.</param>
    /// <returns>Созданный заказ.</returns>
    /// <response code="201">Заказ успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(RegularOrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RegularOrderDto>> Create([FromBody] CreateRegularOrderDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить заказ регулярного рейса.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный заказ.</returns>
    /// <response code="200">Заказ успешно обновлен.</response>
    /// <response code="404">Заказ не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(RegularOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RegularOrderDto>> Update(Guid id, [FromBody] UpdateRegularOrderDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить заказ регулярного рейса.
    /// </summary>
    /// <param name="id">Уникальный идентификатор заказа.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Заказ успешно удален.</response>
    /// <response code="404">Заказ не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
