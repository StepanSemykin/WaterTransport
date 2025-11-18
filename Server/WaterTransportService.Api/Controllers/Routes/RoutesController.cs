using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Routes;

namespace WaterTransportService.Api.Controllers.Routes;

/// <summary>
/// Контроллер для управления маршрутами.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RoutesController(IRouteService service) : ControllerBase
{
    private readonly IRouteService _service = service;

    /// <summary>
    /// Получить список всех маршрутов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список маршрутов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список маршрутов.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить маршрут по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор маршрута.</param>
    /// <returns>Данные маршрута.</returns>
    /// <response code="200">Маршрут успешно найден.</response>
    /// <response code="404">Маршрут не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RouteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RouteDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый маршрут.
    /// </summary>
    /// <param name="dto">Данные для создания маршрута.</param>
    /// <returns>Созданный маршрут.</returns>
    /// <response code="201">Маршрут успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(RouteDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RouteDto>> Create([FromBody] CreateRouteDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующий маршрут.
    /// </summary>
    /// <param name="id">Уникальный идентификатор маршрута.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный маршрут.</returns>
    /// <response code="200">Маршрут успешно обновлен.</response>
    /// <response code="404">Маршрут не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(RouteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RouteDto>> Update(Guid id, [FromBody] UpdateRouteDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить маршрут.
    /// </summary>
    /// <param name="id">Уникальный идентификатор маршрута.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Маршрут успешно удален.</response>
    /// <response code="404">Маршрут не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
