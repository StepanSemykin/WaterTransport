using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Calendars;

namespace WaterTransportService.Api.Controllers.Rent;

/// <summary>
/// Контроллер для управления календарями аренды.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RentCalendarsController(IRentCalendarService service) : ControllerBase
{
    private readonly IRentCalendarService _service = service;

    /// <summary>
    /// Получить список всех календарей аренды с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список календарей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список календарей.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить календарь аренды по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор календаря.</param>
    /// <returns>Данные календаря.</returns>
    /// <response code="200">Календарь успешно найден.</response>
    /// <response code="404">Календарь не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RentCalendarDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentCalendarDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый календарь аренды.
    /// </summary>
    /// <param name="dto">Данные для создания календаря.</param>
    /// <returns>Созданный календарь.</returns>
    /// <response code="201">Календарь успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(RentCalendarDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RentCalendarDto>> Create([FromBody] CreateRentCalendarDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить календарь аренды.
    /// </summary>
    /// <param name="id">Уникальный идентификатор календаря.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный календарь.</returns>
    /// <response code="200">Календарь успешно обновлен.</response>
    /// <response code="404">Календарь не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(RentCalendarDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentCalendarDto>> Update(Guid id, [FromBody] UpdateRentCalendarDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить календарь аренды.
    /// </summary>
    /// <param name="id">Уникальный идентификатор календаря.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Календарь успешно удален.</response>
    /// <response code="404">Календарь не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
