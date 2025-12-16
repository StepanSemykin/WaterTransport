using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Authentication.Authorization;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Ports;

namespace WaterTransportService.Api.Controllers.Ports;

/// <summary>
/// Контроллер для работы с типами портов.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = AppRoles.AnyAuthenticated)]
public class PortTypesController(IPortTypeService service) : ControllerBase
{
    private readonly IPortTypeService _service = service;

    /// <summary>
    /// Получить список всех типов портов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список типов портов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список типов портов.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить тип порта по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор типа порта.</param>
    /// <returns>Данные типа порта.</returns>
    /// <response code="200">Тип порта успешно найден.</response>
    /// <response code="404">Тип порта не найден.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PortTypeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortTypeDto>> GetById(ushort id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый тип порта.
    /// </summary>
    /// <param name="dto">Данные для создания типа порта.</param>
    /// <returns>Созданный тип порта.</returns>
    /// <response code="201">Тип порта успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [Authorize(Roles = AppRoles.Admin)]
    [HttpPost]
    [ProducesResponseType(typeof(PortTypeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PortTypeDto>> Create([FromBody] CreatePortTypeDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующий тип порта.
    /// </summary>
    /// <param name="id">Идентификатор типа порта.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный тип порта.</returns>
    /// <response code="200">Тип порта успешно обновлен.</response>
    /// <response code="404">Тип порта не найден.</response>
    [Authorize(Roles = AppRoles.Admin)]
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PortTypeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortTypeDto>> Update(ushort id, [FromBody] UpdatePortTypeDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить тип порта.
    /// </summary>
    /// <param name="id">Идентификатор типа порта.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Тип порта успешно удален.</response>
    /// <response code="404">Тип порта не найден.</response>
    [Authorize(Roles = AppRoles.Admin)]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(ushort id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
