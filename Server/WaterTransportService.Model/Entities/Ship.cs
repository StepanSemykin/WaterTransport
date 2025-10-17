using System.ComponentModel.DataAnnotations;

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
    [Column("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Идентификатор типа судна.
    /// </summary>
    [Required]
    [Column("ship_type_id")]
    public required ushort ShipTypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на тип судна.
    /// </summary>
    public required ShipType ShipType { get; set; }

    /// <summary>
    /// Вместимость (количество пассажиров).
    /// </summary>
    [Required]
    [Column("capacity")]
    public required ushort Capacity { get; set; }

    /// <summary>
    /// Регистрационный номер судна (уникальное поле).
    /// </summary>
    [Required]
    [MaxLength(11)]
    [Column("registration_number")]
    public required string RegistrationNumber { get; set; }

    /// <summary>
    /// Год изготовления.
    /// </summary>
    [Column("year_of_manufacture", TypeName = "timestamptz")]
    public DateTime? YearOfManufacture { get; set; }

    /// <summary>
    /// Мощность двигателя (если указана).
    /// </summary>
    [Column("power")]
    public ushort? Power { get; set; }

    /// <summary>
    /// Описание двигателя.
    /// </summary>
    [Column("engine")]
    [MaxLength(20)]
    public string? Engine { get; set; }

    /// <summary>
    /// Максимальная скорость судна.
    /// </summary>
    [Column("max_speed")]
    public ushort? MaxSpeed { get; set; }

    /// <summary>
    /// Ширина судна.
    /// </summary>
    [Column("width")]
    public ushort? Width { get; set; }

    /// <summary>
    /// Длина судна.
    /// </summary>
    [Column("length")]
    public ushort? Length { get; set; }

    /// <summary>
    /// Описание судна.
    /// </summary>
    [MaxLength(1000)]
    [Column("description")]
    public string? Description { get; set; }

    /// <summary>
    /// Стоимость аренды в час (минимальные единицы, напр. копейки).
    /// </summary>
    [Column("cost_per_hour")]
    public uint? CostPerHour { get; set; }

    /// <summary>
    /// Идентификатор порта, к которому привязано судно.
    /// </summary>
    [Column("port_id")]
    [Required]
    public required Guid PortId { get; set; }

    /// <summary>
    /// Навигационное свойство на порт, к которому привязано судно.
    /// </summary>
    public required Port Port { get; set; }

    /// <summary>
    /// Навигационное свойство на владельца судна.
    /// </summary>
    [Column("user_id")]
    [Required]
    public required Guid UserId { get; set; }

    /// <summary>
    /// Навигационное свойство на владельца судна.
    /// </summary>
    public required User User { get; set; }

    /// <summary>
    /// Коллекция изображений судна.
    ///</summary>
    public ICollection<ShipImage> ShipImages { get; set; } = [];

    /// <summary>
    /// Отзывы, оставленные про судно.
    /// </summary>
    public ICollection<Review> Reviews { get; set; } = [];
}
