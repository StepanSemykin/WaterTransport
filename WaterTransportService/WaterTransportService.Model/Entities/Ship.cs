namespace WaterTransportService.Model.Entities;

/// <summary>
/// Судно.
/// </summary>
public class Ship
{
    /// <summary>
    /// Идентификатор судна.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Название судна.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Тип судна (внешний ключ на справочник типов).
    /// </summary>
    public required ushort TypeId { get; set; }

    /// <summary>
    /// Навигационное свойство на тип судна.
    /// </summary>
    public required ShipType Type { get; set; }

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
    public required string RegistrationNumber { get; set; } 

    /// <summary>
    /// Мощность двигателя (если указана).
    /// </summary>
    public ushort? Power { get; set; }

    /// <summary>
    /// Описание двигателя.
    /// </summary>
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
    public string? Description { get; set; }

    /// <summary>
    /// Стоимость аренды в час (минимальные единицы, напр. копейки).
    /// </summary>
    public uint? CostPerHour { get; set; }

    /// <summary>
    /// GUID порта, в котором судно зарегистрировано.
    /// </summary>
    public required Guid Portid { get; set; }

    /// <summary>
    /// Навигационное свойство на порт.
    /// </summary>
    public required virtual Port Port { get; set; }

    /// <summary>
    /// GUID владельца судна (пользователь).
    /// </summary>
    public required Guid OwnerUuid { get; set; }

    /// <summary>
    /// Навигационное свойство на владельца судна.
    /// </summary>
    public required virtual User Owner { get; set; }

    /// <summary>
    /// Коллекция изображений судна.
    ///</summary>
    public ICollection<ShipImage> Images { get; set; } = new List<ShipImage>();
}
