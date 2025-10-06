namespace WaterTransportService.Model.Entities;

public class RouteType
{
    public required ushort Id { get; set; }
    public required string Name { get; set; } // 1 - аренда, 2 - фиксированный маршрут
}
