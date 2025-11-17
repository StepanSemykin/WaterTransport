using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Images;

namespace WaterTransportService.Api.Controllers.Images;

/// <summary>
/// Контроллер для управления изображениями пользователей.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UserImagesController(IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto> service, IWebHostEnvironment environment) : ControllerBase
{
    private readonly IImageService<UserImageDto, CreateUserImageDto, UpdateUserImageDto> _service = service;
    private readonly IWebHostEnvironment _environment = environment;

    /// <summary>
    /// Получить список всех изображений пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список изображений пользователей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список изображений.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить изображение пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <returns>Данные изображения пользователя.</returns>
    /// <response code="200">Изображение успешно найдено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UserImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserImageDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Получить основное (primary) изображение пользователя по идентификатору пользователя (UserId).
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Файл основного изображения.</returns>
    /// <response code="200">Файл изображения успешно найден и возвращен.</response>
    /// <response code="404">Файл не найден.</response>
    [HttpGet("file/{userId:guid}")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetImage(Guid userId)
    {
        var dto = await _service.GetPrimaryImageByEntityIdAsync(userId);
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
    /// Получить все файлы изображений пользователя в base64 формате.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Массив изображений с данными в base64.</returns>
    /// <response code="200">Файлы изображений успешно получены.</response>
    [HttpGet("user/{userId:guid}/files")]
    [ProducesResponseType(typeof(object[]), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllImageFiles(Guid userId)
    {
        var images = await _service.GetAllImagesByEntityIdAsync(userId);
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

    /// <summary>
    /// Создать новое изображение пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания изображения (форма multipart/form-data). Поиск пользователя осуществляется по телефону.</param>
    /// <returns>Созданное изображение пользователя.</returns>
    /// <response code="201">Изображение успешно создано.</response>
    /// <response code="400">Недопустимый телефон пользователя или файл изображения.</response>
    [HttpPost]
    [ProducesResponseType(typeof(UserImageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserImageDto>> Create([FromForm] CreateUserImageDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest("Invalid user id or image file") : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующее изображение пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления (форма multipart/form-data).</param>
    /// <returns>Обновленное изображение пользователя.</returns>
    /// <response code="200">Изображение успешно обновлено.</response>
    /// <response code="404">Изображение не найдено.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(UserImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserImageDto>> Update(Guid id, [FromForm] UpdateUserImageDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить изображение пользователя.
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
