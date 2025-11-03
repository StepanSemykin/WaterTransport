using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;

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
    /// Тип порта.
    /// </summary>
    [Column("port_type_id")]
    [Required]
    public required ushort PortTypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на тип порта.
    /// </summary>
    public required PortType PortType { get; set; }

    /// <summary>
    /// Широта в градусах (от -90 до 90).
    /// </summary>
    [Range(-90, 90)]
    [Column("latitude")]
    [Required]
    public required double Latitude { get; set; }

    /// <summary>
    /// Долгота в градусах (от -180 до 180).
    /// </summary>
    [Range(-180, 180)]
    [Column("longitude")]
    [Required]
    public required double Longitude { get; set; }

    /// <summary>
    /// Адрес порта.
    /// </summary>
    [Required]
    [MaxLength(256)]
    [Column("address")]
    public required string Address { get; set; }

    /// <summary>
    /// Коллекция судов, зарегистрированных в порту.
    /// </summary>
    public ICollection<Ship> Ships { get; set; } = [];

    /// <summary>
    /// Коллекция изображений порта.
    /// </summary>
    public ICollection<PortImage> PortImages { get; set; } = [];
}
