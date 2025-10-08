namespace WaterTransportService.Model.Entities;

/// <summary>
/// Изображение пользователя и сопутствующие метаданные.
/// </summary>
public class UserImage : BaseEntity
{
    /// <summary>
    /// Идентификатор изображения.
    /// </summary>
    public required uint Id { get; set; }

    /// <summary>
    /// GUID пользователя-владельца (внешний ключ на User.Uuid).
    /// </summary>
    public required Guid UserUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на владельца изображения.
    /// </summary>
    public required virtual User User { get; set; }

    /// <summary>
    /// Путь к файлу изображения (локально или URL в хранилище).
    /// </summary>
    public required string ImagePath { get; set; }

    /// <summary>
    /// Путь к миниатюре (если создаётся).
    /// </summary>
    public string? ThumbPath { get; set; }

    /// <summary>
    /// MIME-тип изображения (например, "image/jpeg").
    /// </summary>
    public string? MimeType { get; set; }

    /// <summary>
    /// Размер файла в байтах.
    /// </summary>
    public long? FileSize { get; set; }    // байты

    /// <summary>
    /// Ширина изображения в пикселях.
    /// </summary>
    public int? Width { get; set; }

    /// <summary>
    /// Высота изображения в пикселях.
    /// </summary>
    public int? Height { get; set; }

    /// <summary>
    /// Флаг, указывающий, что это основное (профильное) изображение пользователя.
    /// </summary>
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Время загрузки изображения в UTC.
    /// </summary>
    public required DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
