namespace WaterTransportService.Model.Entities;

/// <summary>
/// Изображение судна с метаданными.
/// </summary>
public class ShipImage : BaseEntity
{
    /// <summary>
    /// Идентификатор изображения судна.
    /// </summary>
    public required uint Id { get; set; }

    /// <summary>
    /// Идентификатор судна (внешний ключ).
    /// </summary>
    public required uint ShipId { get; set; }

    /// <summary>
    /// Навигационное свойство на судно.
    /// </summary>
    public required virtual Ship Ship { get; set; }

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
    /// Флаг, указывающий, что это основное изображение судна.
    /// </summary>
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Время загрузки изображения в UTC.
    /// </summary>
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
