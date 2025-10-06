namespace WaterTransportService.Model.Entities;

public class Password
{
    public required uint Id { get; set; }
    public required Guid UserUuid { get; set; }
    public required string Hash { get; set; }
    public required bool Version { get; set; }
}
