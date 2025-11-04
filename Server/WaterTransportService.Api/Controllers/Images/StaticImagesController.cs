using Microsoft.AspNetCore.Mvc;

namespace WaterTransportService.Api.Controllers.Images;

/// <summary>
/// Контроллер для доступа к статическим изображениям.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StaticImagesController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public StaticImagesController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    /// <summary>
    /// Получить изображение по категории и имени файла.
    /// </summary>
    /// <param name="category">Категория изображения (Ports, Ships, Users).</param>
    /// <param name="filename">Имя файла изображения.</param>
    /// <returns>Файл изображения.</returns>
    /// <response code="200">Файл изображения успешно найден и возвращен.</response>
    /// <response code="400">Недопустимая категория.</response>
    /// <response code="404">Файл не найден.</response>
    [HttpGet("{category}/{filename}")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetImage(string category, string filename)
    {
        // Разрешенные категории
        var allowedCategories = new[] { "Ports", "Ships", "Users" };
        if (!allowedCategories.Contains(category, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("Invalid category");
        }

        // Построение пути к файлу
        var imagesBasePath = Path.Combine(
            Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, 
            "Images"
        );
        var filePath = Path.Combine(imagesBasePath, category, filename);

        // Проверка существования файла
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound();
        }

        // Определение MIME-типа
        var extension = Path.GetExtension(filename).ToLowerInvariant();
        var contentType = extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".bmp" => "image/bmp",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        // Возврат файла
        var fileStream = System.IO.File.OpenRead(filePath);
        return File(fileStream, contentType);
    }
}
