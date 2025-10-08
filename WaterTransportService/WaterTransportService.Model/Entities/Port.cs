namespace WaterTransportService.Model.Entities;

/// <summary>
/// Порт
/// </summary>
public class Port
{
    /// <summary>
    /// Идентификатор порта.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Название порта.
    /// </summary>
    public required string Title{ get; set; }

    /// <summary>
    /// Тип порта (внешний ключ на справочник типов).
    /// </summary>
    public required ushort TypeId { get; set; }

    /// <summary>
    /// Широта в градусах (от -90 до 90).
    /// </summary>
    public required double Latitude { get; set; }  // от -90 до 90

    /// <summary>
    /// Долгота в градусах (от -180 до 180).
    /// </summary>
    public required double Longitude { get; set; } // от -180 до 180

    /// <summary>
    /// Адрес порта.
    /// </summary>
    public required string Address { get; set; }

    /// <summary>
    /// Коллекция судов, зарегистрированных в порту.
    /// </summary>
    public required ICollection<Ship> Ships { get; set; }

    /// <summary>
    /// Коллекция изображений порта.
    /// </summary>
    public ICollection<PortImage> PortImages { get; set; } = new List<PortImage>();
}
