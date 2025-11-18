using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Images;

namespace WaterTransportService.Api.Controllers.Images;

/// <summary>
/// Контроллер для управления изображениями судов.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ShipImagesController(IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto> service, IWebHostEnvironment environment) : ControllerBase
{
    private readonly IImageService<ShipImageDto, CreateShipImageDto, UpdateShipImageDto> _service = service;
    private readonly IWebHostEnvironment _environment = environment;

    /// <summary>
    /// Получить список всех изображений судов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список изображений судов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список изображений.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);

        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить изображение судна по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <returns>Данные изображения судна.</returns>
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
    /// Создать новое изображение судна.
    /// </summary>
    /// <param name="dto">Данные для создания изображения (форма multipart/form-data).</param>
    /// <returns>Созданное изображение судна.</returns>
    /// <response code="201">Изображение успешно создано.</response>
    /// <response code="400">Недопустимый ID судна или файл изображения.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ShipImageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShipImageDto>> Create([FromForm] CreateShipImageDto dto)
    {
        var created = await _service.CreateAsync(dto);

        return created is null ? BadRequest("Invalid ship ID or image file") : Ok(created);
    }

    /// <summary>
    /// Обновить существующее изображение судна.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления (форма multipart/form-data).</param>
    /// <returns>Обновленное изображение судна.</returns>
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
    /// Удалить изображение судна.
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
    /// Получить основное (primary) изображение судна по идентификатору судна (ShipId).
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Файл основного изображения.</returns>
    /// <response code="200">Файл изображения успешно найден и возвращен.</response>
    /// <response code="404">Файл не найден.</response>
    [HttpGet("file/{shipId:guid}")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetImage(Guid shipId)
    {
        var dto = await _service.GetPrimaryImageByEntityIdAsync(shipId);
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
    /// Получить все изображения судна по идентификатору судна (ShipId).
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Список данных всех изображений судна.</returns>
    /// <response code="200">Список изображений успешно получен.</response>
    [HttpGet("ship/{shipId:guid}")]
    [ProducesResponseType(typeof(IReadOnlyList<ShipImageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ShipImageDto>>> GetAllImages(Guid shipId)
    {
        var images = await _service.GetAllImagesByEntityIdAsync(shipId);
        return Ok(images);
    }

    /// <summary>
    /// Получить все файлы изображений судна в base64 формате.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Массив изображений с данными в base64.</returns>
    /// <response code="200">Файлы изображений успешно получены.</response>
    [HttpGet("ship/{shipId:guid}/files")]
    [ProducesResponseType(typeof(object[]), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllImageFiles(Guid shipId)
    {
        var images = await _service.GetAllImagesByEntityIdAsync(shipId);
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
