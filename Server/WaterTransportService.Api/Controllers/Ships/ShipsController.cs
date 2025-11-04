using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Ships;

namespace WaterTransportService.Api.Controllers.Ships;

/// <summary>
/// Контроллер для управления кораблями.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ShipsController(IShipService service) : ControllerBase
{
    private readonly IShipService _service = service;

    /// <summary>
    /// Получить список всех кораблей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список кораблей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список кораблей.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить корабль по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор корабля.</param>
    /// <returns>Данные корабля.</returns>
    /// <response code="200">Корабль успешно найден.</response>
    /// <response code="404">Корабль не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ShipDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый корабль.
    /// </summary>
    /// <param name="dto">Данные для создания корабля.</param>
    /// <returns>Созданный корабль.</returns>
    /// <response code="201">Корабль успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ShipDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShipDto>> Create([FromBody] CreateShipDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующий корабль.
    /// </summary>
    /// <param name="id">Уникальный идентификатор корабля.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный корабль.</returns>
    /// <response code="200">Корабль успешно обновлен.</response>
    /// <response code="404">Корабль не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ShipDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipDto>> Update(Guid id, [FromBody] UpdateShipDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить корабль.
    /// </summary>
    /// <param name="id">Уникальный идентификатор корабля.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Корабль успешно удален.</response>
    /// <response code="404">Корабль не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
