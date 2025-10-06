namespace WaterTransportService.Model.Entities;

public class Role
{
    public required uint Id { get; set; }
    public required string Name { get; set; }

    public required Guid UserUuid { get; set; }
    public required User User { get; set; }
}
