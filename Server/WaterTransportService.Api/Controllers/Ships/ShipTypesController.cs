using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Ships;

namespace WaterTransportService.Api.Controllers.Ships;

/// <summary>
/// Контроллер для управления типами кораблей.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ShipTypesController(IShipTypeService service) : ControllerBase
{
    private readonly IShipTypeService _service = service;

    /// <summary>
    /// Получить список всех типов кораблей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список типов кораблей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список типов кораблей.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить тип корабля по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор типа корабля.</param>
    /// <returns>Данные типа корабля.</returns>
    /// <response code="200">Тип корабля успешно найден.</response>
    /// <response code="404">Тип корабля не найден.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ShipTypeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipTypeDto>> GetById(ushort id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый тип корабля.
    /// </summary>
    /// <param name="dto">Данные для создания типа корабля.</param>
    /// <returns>Созданный тип корабля.</returns>
    /// <response code="201">Тип корабля успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ShipTypeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShipTypeDto>> Create([FromBody] CreateShipTypeDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующий тип корабля.
    /// </summary>
    /// <param name="id">Идентификатор типа корабля.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный тип корабля.</returns>
    /// <response code="200">Тип корабля успешно обновлен.</response>
    /// <response code="404">Тип корабля не найден.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ShipTypeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipTypeDto>> Update(ushort id, [FromBody] UpdateShipTypeDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить тип корабля.
    /// </summary>
    /// <param name="id">Идентификатор типа корабля.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Тип корабля успешно удален.</response>
    /// <response code="404">Тип корабля не найден.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(ushort id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
