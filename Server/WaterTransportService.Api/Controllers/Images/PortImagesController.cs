using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Images;

namespace WaterTransportService.Api.Controllers.Images;

/// <summary>
/// Контроллер для управления изображениями портов.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PortImagesController(IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto> service, IWebHostEnvironment environment) : ControllerBase
{
    private readonly IImageService<PortImageDto, CreatePortImageDto, UpdatePortImageDto> _service = service;
    private readonly IWebHostEnvironment _environment = environment;

    /// <summary>
    /// Получить список всех изображений портов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список изображений портов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список изображений.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить изображение порта по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <returns>Данные изображения порта.</returns>
    /// <response code="200">Изображение успешно найдено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PortImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortImageDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новое изображение порта.
    /// </summary>
    /// <param name="dto">Данные для создания изображения (форма multipart/form-data). Поиск порта осуществляется по названию.</param>
    /// <returns>Созданное изображение порта.</returns>
    /// <response code="201">Изображение успешно создано.</response>
    /// <response code="400">Недопустимое название порта или файл изображения.</response>
    [HttpPost]
    [ProducesResponseType(typeof(PortImageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PortImageDto>> Create([FromForm] CreatePortImageDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest("Invalid port title or image file") : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующее изображение порта.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления (форма multipart/form-data).</param>
    /// <returns>Обновленное изображение порта.</returns>
    /// <response code="200">Изображение успешно обновлено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PortImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortImageDto>> Update(Guid id, [FromForm] UpdatePortImageDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить изображение порта.
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

    /// <summary>
    /// Получить основное (primary) изображение порта по идентификатору порта (PortId).
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Файл основного изображения.</returns>
    /// <response code="200">Файл изображения успешно найден и возвращен.</response>
    /// <response code="404">Файл не найден.</response>
    [HttpGet("file/{portId:guid}")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetImage(Guid portId)
    {
        var dto = await _service.GetPrimaryImageByEntityIdAsync(portId);
        if (dto is null) return NotFound();

        var fullPath = Path.Combine(Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, dto.ImagePath);
        if (!System.IO.File.Exists(fullPath)) return NotFound();

        var extension = Path.GetExtension(fullPath).ToLowerInvariant();
        var contentType = extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".bmp" => "image/bmp",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        var stream = System.IO.File.OpenRead(fullPath);
        return File(stream, contentType);
    }

    /// <summary>
    /// Получить все изображения порта по идентификатору порта (PortId).
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Список данных всех изображений порта.</returns>
    /// <response code="200">Список изображений успешно получен.</response>
    [HttpGet("port/{portId:guid}")]
    [ProducesResponseType(typeof(IReadOnlyList<PortImageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PortImageDto>>> GetAllImages(Guid portId)
    {
        var images = await _service.GetAllImagesByEntityIdAsync(portId);
        return Ok(images);
    }

    /// <summary>
    /// Получить все файлы изображений порта в base64 формате.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Массив изображений с данными в base64.</returns>
    /// <response code="200">Файлы изображений успешно получены.</response>
    [HttpGet("port/{portId:guid}/files")]
    [ProducesResponseType(typeof(object[]), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllImageFiles(Guid portId)
    {
        var images = await _service.GetAllImagesByEntityIdAsync(portId);
        if (!images.Any())
            return Ok(Array.Empty<object>());

        var rootPath = Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath;
        var result = new List<object>();

        foreach (var img in images)
        {
            var fullPath = Path.Combine(rootPath, img.ImagePath);
            if (!System.IO.File.Exists(fullPath))
                continue;

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            var extension = Path.GetExtension(fullPath).ToLowerInvariant();
            var contentType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };

            result.Add(new
            {
                id = img.Id,
                isPrimary = img.IsPrimary,
                contentType,
                data = Convert.ToBase64String(bytes)
            });
        }

        return Ok(result);
    }
}
