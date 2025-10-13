using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WaterTransportService.Model.Entities;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Судно.
/// </summary>
[Table("ships")]
public class Ship
{
    /// <summary>
    /// Идентификатор судна.
    /// </summary>
    [Key]
    [Column("id", TypeName = "uuid")]
    public required Guid Id { get; set; }

    /// <summary>
    /// Название судна.
    /// </summary>
    [Required]
    [MaxLength(256)]
    public required string Name { get; set; }

    /// <summary>
    /// Тип судна (внешний ключ на справочник типов).
    /// </summary>
    public required ushort TypeId { get; set; }

    /// <summary>
    /// Вместимость (количество пассажиров).
    /// </summary>
    public required ushort Capacity { get; set; }

    /// <summary>
    /// Год изготовления.
    /// </summary>
    public DateTime? YearOfManufacture { get; set; } 

    /// <summary>
    /// Регистрационный номер судна (уникальное поле).
    /// </summary>
    [Required]
    [MaxLength(128)]
    public required string RegistrationNumber { get; set; } 

    /// <summary>
    /// Мощность двигателя (если указана).
    /// </summary>
    public ushort? Power { get; set; }

    /// <summary>
    /// Описание двигателя.
    /// </summary>
    [MaxLength(256)]
    public string? Engine { get; set; }

    /// <summary>
    /// Максимальная скорость судна.
    /// </summary>
    public ushort? MaxSpeed { get; set; }

    /// <summary>
    /// Ширина судна.
    /// </summary>
    public ushort? Width { get; set; }

    /// <summary>
    /// Длина судна.
    /// </summary>
    public ushort? Length { get; set; }

    /// <summary>
    /// Описание судна.
    /// </summary>
    [MaxLength(2000)]
    public string? Description { get; set; }

    /// <summary>
    /// Стоимость аренды в час (минимальные единицы, напр. копейки).
    /// </summary>
    public uint? CostPerHour { get; set; }

    /// <summary>
    /// GUID порта, в котором судно зарегистрировано.
    /// </summary>
    [Column("port_id", TypeName = "uuid")]
    [Required]
    public required Guid Portid { get; set; }

    [ForeignKey(nameof(Portid))]
    [InverseProperty(nameof(Port.Ships))]
    public required virtual Port Port { get; set; }

    /// <summary>
    /// GUID владельца судна (пользователь).
    /// </summary>
    [Column("owner_uuid", TypeName = "uuid")]
    [Required]
    public required Guid OwnerUuid { get; set; }

    [ForeignKey(nameof(OwnerUuid))]
    [InverseProperty(nameof(User.Ships))]
    public required virtual User Owner { get; set; }

    /// <summary>
    /// Коллекция изображений судна.
    ///</summary>
    public ICollection<ShipImage> Images { get; set; } = new List<ShipImage>();

    /// <summary>
    /// Отзывы, оставленные про судно.
    /// </summary>
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
