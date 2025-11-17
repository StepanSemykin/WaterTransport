using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Api.DTO;

/// <summary>
/// DTO дл€ чтени€ изображени€ судна.
/// </summary>
/// <param name="Id">”никальный идентификатор изображени€.</param>
/// <param name="ShipId">»дентификатор судна.</param>
/// <param name="ImagePath">ѕуть к файлу изображени€.</param>
/// <param name="IsPrimary">явл€етс€ ли изображение основным.</param>
/// <param name="UploadedAt">ƒата и врем€ загрузки изображени€.</param>
public record ShipImageDto(
    Guid Id,
    Guid ShipId,
    string ImagePath,
    bool IsPrimary,
    DateTime UploadedAt
);

/// <summary>
/// DTO дл€ создани€ изображени€ судна.
/// </summary>
public class CreateShipImageDto
{
    /// <summary>
    /// »дентификатор судна.
    /// </summary>
    [Required]
    public required Guid ShipId { get; set; }

    /// <summary>
    /// ‘айл изображени€.
    /// </summary>
    [Required]
    public required IFormFile Image { get; set; }

    /// <summary>
    /// явл€етс€ ли изображение основным.
    /// </summary>
    public bool IsPrimary { get; set; }
}

/// <summary>
/// DTO дл€ обновлени€ изображени€ судна.
/// </summary>
public class UpdateShipImageDto
{
    /// <summary>
    /// Ќовый файл изображени€ (необ€зательно).
    /// </summary>
    public IFormFile? Image { get; set; }

    /// <summary>
    /// явл€етс€ ли изображение основным (необ€зательно).
    /// </summary>
    public bool? IsPrimary { get; set; }
}
