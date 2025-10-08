namespace WaterTransportService.Model.Entities;

/// <summary>
/// Изображение порта с метаданными.
/// </summary>
public class PortImage : BaseEntity
{
    /// <summary>
    /// Идентификатор изображения порта.
    /// </summary>
    public required uint Id { get; set; }

    /// <summary>
    /// Идентификатор порта (внешний ключ).
    /// </summary>
    public required Guid PortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт.
    /// </summary>
    public required virtual Port Port { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL).
    /// </summary>
    public required string ImagePath { get; set; }

    /// <summary>
    /// Путь к миниатюры (если создаётся).
    /// </summary>
    public string? ThumbPath { get; set; }

    /// <summary>
    /// MIME-тип изображения (например, "image/jpeg").
    /// </summary>
    public string? MimeType { get; set; }

    /// <summary>
    /// Размер файла в байтах.
    /// </summary>
    public long? FileSize { get; set; }

    /// <summary>
    /// Ширина изображения в пикселях.
    /// </summary>
    public int? Width { get; set; }

    /// <summary>
    /// Высота изображения в пикселях.
    /// </summary>
    public int? Height { get; set; }

    /// <summary>
    /// Флаг, указывающий, что это основное изображение порта.
    /// </summary>
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Время загрузки изображения в UTC.
    /// </summary>
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
