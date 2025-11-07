using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

/// <summary>
/// DTO для чтения изображения корабля.
/// </summary>
/// <param name="Id">Уникальный идентификатор изображения.</param>
/// <param name="ShipId">Идентификатор корабля.</param>
/// <param name="ImagePath">Путь к файлу изображения.</param>
/// <param name="IsPrimary">Является ли изображение основным.</param>
/// <param name="UploadedAt">Дата и время загрузки изображения.</param>
public record ShipImageDto(
    Guid Id,
    Guid ShipId,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

/// <summary>
/// DTO для создания изображения корабля.
/// </summary>
public class CreateShipImageDto
{
    /// <summary>
    /// Идентификатор корабля.
    /// </summary>
    [Required]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// Файл изображения.
    /// </summary>
    [Required]
    public required IFormFile Image { get; set; }

    /// <summary>
    /// Является ли изображение основным.
    /// </summary>
    public bool IsPrimary { get; set; }
}

/// <summary>
/// DTO для обновления изображения корабля.
/// </summary>
public class UpdateShipImageDto
{
    /// <summary>
    /// Новый файл изображения (необязательно).
    /// </summary>
    public IFormFile? Image { get; set; }

    /// <summary>
    /// Является ли изображение основным (необязательно).
    /// </summary>
    public bool? IsPrimary { get; set; }
}
