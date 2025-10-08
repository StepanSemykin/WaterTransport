namespace WaterTransportService.Model.Entities;

/// <summary>
/// Справочник типов судов.
/// </summary>
public class ShipType
{
    /// <summary>
    /// Идентификатор типа судна.
    /// </summary>
    public required ushort Id { get; set; }

    /// <summary>
    /// Название типа судна.
    /// </summary>
    public required string Name { get; set; }
}