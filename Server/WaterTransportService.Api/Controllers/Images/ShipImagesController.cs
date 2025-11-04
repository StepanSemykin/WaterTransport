using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Images;

namespace WaterTransportService.Api.Controllers.Images;

/// <summary>
/// Контроллер для управления изображениями кораблей.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ShipImagesController(IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto> service) : ControllerBase
{
    private readonly IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto> _service = service;

    /// <summary>
    /// Получить список всех изображений кораблей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список изображений кораблей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список изображений.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить изображение корабля по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <returns>Данные изображения корабля.</returns>
    /// <response code="200">Изображение успешно найдено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ShipImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipImageDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новое изображение корабля.
    /// </summary>
    /// <param name="dto">Данные для создания изображения (форма multipart/form-data).</param>
    /// <returns>Созданное изображение корабля.</returns>
    /// <response code="201">Изображение успешно создано.</response>
    /// <response code="400">Недопустимый ID корабля или файл изображения.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ShipImageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShipImageDto>> Create([FromForm] CreateShipImageDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest("Invalid ship ID or image file") : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующее изображение корабля.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления (форма multipart/form-data).</param>
    /// <returns>Обновленное изображение корабля.</returns>
    /// <response code="200">Изображение успешно обновлено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ShipImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShipImageDto>> Update(Guid id, [FromForm] UpdateShipImageDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить изображение корабля.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Изображение успешно удалено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
