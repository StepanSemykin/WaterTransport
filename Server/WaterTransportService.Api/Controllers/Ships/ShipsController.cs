using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Ships;

namespace WaterTransportService.Api.Controllers.Ships;

/// <summary>
/// Контроллер для управления судами.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ShipsController(IShipService service) : ControllerBase
{
    private readonly IShipService _service = service;

    /// <summary>
    /// Получить список всех судов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список судов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список судов.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить судно по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор судна.</param>
    /// <returns>Данные судна.</returns>
    /// <response code="200">Судно успешно найдено.</response>
    /// <response code="404">Судно не найдено.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ShipDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipDto>> GetById(Guid id)
    {
        var ship = await _service.GetByIdAsync(id);

        return ship is null ? NotFound() : Ok(ship);
    }

    /// <summary>
    /// Получить список всех судов текущего пользователя (по токену).
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Размер страницы (по умолчанию 20, максимум 100).</param>
    /// <returns>Список судов пользователя с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список судов пользователя.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    //[Authorize] // нужна аутентификация по JWT
    [HttpGet("my-ships")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetMyShips([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
        if (!Guid.TryParse(id, out var userId))
        {
            return Unauthorized();
        }

        var (items, total) = await _service.GetByUserAsync(userId, page, pageSize);

        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Создать новое судно.
    /// </summary>
    /// <param name="dto">Данные для создания судна.</param>
    /// <returns>Созданное судно.</returns>
    /// <response code="201">Судно успешно создано.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ShipDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShipDto>> Create([FromBody] CreateShipDto dto)
    {
        var created = await _service.CreateAsync(dto);

        return created is null ? BadRequest() : Ok(created);
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
