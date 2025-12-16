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
    private readonly long _maxFileSize = 10 * 1024 * 1024;
    private readonly string[] _allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    private readonly string[] _allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];

    public FileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
        _imagesBasePath = Path.Combine(Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, "Images");

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

        var targetFolder = Path.Combine(_imagesBasePath, subfolder);
        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(targetFolder, uniqueFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine("Images", subfolder, uniqueFileName);
    }

    public async Task<string> SaveImageAsync(IFormFile file, string subfolder, string fileNameWithoutExtension)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Файл не может быть пустым.", nameof(file));

        if (!IsValidImage(file))
            throw new InvalidOperationException("Недопустимый формат файла. Разрешены только изображения.");

        var targetFolder = Path.Combine(_imagesBasePath, subfolder);
        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"{fileNameWithoutExtension}{fileExtension}";
        var filePath = Path.Combine(targetFolder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine("Images", subfolder, fileName);
    }

    public Task<bool> DeleteImageAsync(string imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
            return Task.FromResult(false);

        try
        {
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

    public async Task<string?> GetImageAsBase64Async(string imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
            return null;

        try
        {
            var fullPath = Path.IsPathRooted(imagePath)
                ? imagePath
                : Path.Combine(Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, imagePath);

            if (!File.Exists(fullPath))
                return null;

            var bytes = await File.ReadAllBytesAsync(fullPath);
            return Convert.ToBase64String(bytes);
        }
        catch
        {
            return null;
        }
    }

    public async Task<(string? Base64, string? MimeType)> GetImageAsBase64WithMimeTypeAsync(string imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
            return (null, null);

        try
        {
            var fullPath = Path.IsPathRooted(imagePath)
                ? imagePath
                : Path.Combine(Directory.GetParent(_environment.ContentRootPath)?.FullName ?? _environment.ContentRootPath, imagePath);

            if (!File.Exists(fullPath))
                return (null, null);

            var bytes = await File.ReadAllBytesAsync(fullPath);
            var base64 = Convert.ToBase64String(bytes);

            // Определяем MIME тип по расширению файла
            var extension = Path.GetExtension(fullPath).ToLowerInvariant();
            var mimeType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };

            return (base64, mimeType);
        }
        catch
        {
            return (null, null);
        }
    }
}
