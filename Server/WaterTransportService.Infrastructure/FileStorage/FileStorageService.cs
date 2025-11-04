using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace WaterTransportService.Infrastructure.FileStorage;

/// <summary>
/// Реализация сервиса для работы с файлами изображений.
/// </summary>
public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string _imagesBasePath;
    private readonly long _maxFileSize = 10 * 1024 * 1024; // 10 MB
    private readonly string[] _allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    private readonly string[] _allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];

    public FileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
        // Путь к папке Images в корне Server
        _imagesBasePath = Path.Combine(Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, "Images");
        
        // Создаем базовую папку, если она не существует
        if (!Directory.Exists(_imagesBasePath))
        {
            Directory.CreateDirectory(_imagesBasePath);
        }
    }

    public async Task<string> SaveImageAsync(IFormFile file, string subfolder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Файл не может быть пустым.", nameof(file));

        if (!IsValidImage(file))
            throw new InvalidOperationException("Недопустимый формат файла. Разрешены только изображения.");

        // Создаем подпапку, если она не существует
        var targetFolder = Path.Combine(_imagesBasePath, subfolder);
        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        // Генерируем уникальное имя файла
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(targetFolder, uniqueFileName);

        // Сохраняем файл на диск
        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Возвращаем относительный путь (от папки Server)
        return Path.Combine("Images", subfolder, uniqueFileName);
    }

    public Task<bool> DeleteImageAsync(string imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
            return Task.FromResult(false);

        try
        {
            // Путь может быть относительным от Server или полным
            var fullPath = Path.IsPathRooted(imagePath)
                ? imagePath
                : Path.Combine(Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, imagePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public bool IsValidImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return false;

        if (file.Length > _maxFileSize)
            return false;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
            return false;

        if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            return false;

        return true;
    }
}
