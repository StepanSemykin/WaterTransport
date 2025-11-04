using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Ports;

namespace WaterTransportService.Api.Controllers.Ports;

/// <summary>
/// Контроллер для управления портами.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PortsController(IPortService service) : ControllerBase
{
    private readonly IPortService _service = service;

    /// <summary>
    /// Получить список всех портов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список портов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список портов.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить порт по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор порта.</param>
    /// <returns>Данные порта.</returns>
    /// <response code="200">Порт успешно найден.</response>
    /// <response code="404">Порт не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PortDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый порт.
    /// </summary>
    /// <param name="dto">Данные для создания порта.</param>
    /// <returns>Созданный порт.</returns>
    /// <response code="201">Порт успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(PortDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PortDto>> Create([FromBody] CreatePortDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующий порт.
    /// </summary>
    /// <param name="id">Уникальный идентификатор порта.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный порт.</returns>
    /// <response code="200">Порт успешно обновлен.</response>
    /// <response code="404">Порт не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PortDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortDto>> Update(Guid id, [FromBody] UpdatePortDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить порт.
    /// </summary>
    /// <param name="id">Уникальный идентификатор порта.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Порт успешно удален.</response>
    /// <response code="404">Порт не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
