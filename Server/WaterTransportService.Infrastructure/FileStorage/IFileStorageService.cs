using Microsoft.AspNetCore.Http;

namespace WaterTransportService.Infrastructure.FileStorage;

/// <summary>
/// Сервис для работы с файлами изображений.
/// </summary>
public interface IFileStorageService
{
    /// <summary>
    /// Сохраняет изображение на диск и возвращает относительный путь к файлу.
    /// </summary>
    /// <param name="file">Файл изображения для сохранения.</param>
    /// <param name="subfolder">Подпапка внутри Images (например, "Ports", "Ships", "Users").</param>
    /// <returns>Относительный путь к сохраненному файлу.</returns>
    Task<string> SaveImageAsync(IFormFile file, string subfolder);

    /// <summary>
    /// Сохраняет изображение на диск с заданным именем файла (без расширения).
    /// Расширение берётся из загруженного файла.
    /// </summary>
    /// <param name="file">Файл изображения для сохранения.</param>
    /// <param name="subfolder">Подпапка внутри Images (например, "Users").</param>
    /// <param name="fileNameWithoutExtension">Имя файла без расширения (например, GUID).</param>
    /// <returns>Относительный путь к сохраненному файлу.</returns>
    Task<string> SaveImageAsync(IFormFile file, string subfolder, string fileNameWithoutExtension);

    /// <summary>
    /// Удаляет изображение с диска.
    /// </summary>
    /// <param name="imagePath">Относительный путь к файлу.</param>
    /// <returns>True, если файл был успешно удален.</returns>
    Task<bool> DeleteImageAsync(string imagePath);

    /// <summary>
    /// Проверяет, является ли файл допустимым изображением.
    /// </summary>
    /// <param name="file">Файл для проверки.</param>
    /// <returns>True, если файл является изображением.</returns>
    bool IsValidImage(IFormFile file);

    /// <summary>
    /// Читает изображение по пути и возвращает его в формате Base64.
    /// </summary>
    /// <param name="imagePath">Относительный путь к изображению.</param>
    /// <returns>Строка Base64 с содержимым изображения или null, если файл не найден.</returns>
    Task<string?> GetImageAsBase64Async(string imagePath);
}
