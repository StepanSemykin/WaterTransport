namespace WaterTransportService.Model.Entities;

public class Ship
{
    public required uint Id { get; set; }
    public required string Name { get; set; }
    public required ushort TypeId { get; set; }
    public required ushort Capacity { get; set; }
    public DateTime? YearOfManufacture { get; set; } 
    public required string RegistrationNumber { get; set; } //добавить в бд!!! уникальное поле
    public ushort? Power { get; set; }
    public string? Engine { get; set; }
    public ushort? MaxSpeed { get; set; }
    public ushort? Width { get; set; }
    public ushort? Length { get; set; }
    public string? Description { get; set; }
    public uint? CostPerHour { get; set; }
    public required Guid Portid { get; set; }
    public required Port Port { get; set; }
    public required Guid OwnerUuid { get; set; }
    public required User Owner { get; set; }

    //public ICollection<ShipImage> Images { get; set; }
}
