using System.ComponentModel.DataAnnotations;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Порт
/// </summary>
[Table("ports")]
public class Port
{
    /// <summary>
    /// Идентификатор порта.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Название порта.
    /// </summary>
    [Required]
    [MaxLength(256)]
    [Column("title")]
    public required string Title { get; set; }

    /// <summary>
    /// Тип порта (внешний ключ на справочник типов).
    /// </summary>
    [Column("type_id")]
    public required ushort TypeId { get; set; }

    /// <summary>
    /// Широта в градусах (от -90 до 90).
    /// </summary>
    [Range(-90, 90)]
    [Column("latitude")]
    public required double Latitude { get; set; }  // от -90 до 90

    /// <summary>
    /// Долгота в градусах (от -180 до 180).
    /// </summary>
    [Range(-180, 180)]
    [Column("longitude")]
    public required double Longitude { get; set; } // от -180 до 180

    /// <summary>
    /// Адрес порта.
    /// </summary>
    [Required]
    [MaxLength(512)]
    [Column("address")]
    public required string Address { get; set; }

    /// <summary>
    /// Коллекция судов, зарегистрированных в порту.
    /// </summary>
    [InverseProperty(nameof(Ship.Port))]
    public ICollection<Ship> Ships { get; set; } = new List<Ship>();

    /// <summary>
    /// Коллекция изображений порта.
    /// </summary>
    [InverseProperty(nameof(PortImage.Port))]
    public ICollection<PortImage> Images { get; set; } = new List<PortImage>();
}
