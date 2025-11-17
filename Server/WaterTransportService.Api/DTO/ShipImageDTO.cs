using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

/// <summary>
/// DTO для чтения изображения судна.
/// </summary>
/// <param name="ShipName">Название судна.</param>
/// <param name="ImagePath">Путь к файлу изображения.</param>
/// <param name="IsPrimary">Является ли изображение основным.</param>
/// <param name="UploadedAt">Дата и время загрузки изображения.</param>
public record ShipImageDto(
    //Guid Id,
    //Guid ShipId,
    string ShipName,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

/// <summary>
/// DTO для создания изображения судна.
/// </summary>
public class CreateShipImageDto
{
    /// <summary>
    /// Название судна.
    /// </summary>
    [Required]
    public required string ShipName { get; set; }

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
/// DTO для обновления изображения судна.
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
