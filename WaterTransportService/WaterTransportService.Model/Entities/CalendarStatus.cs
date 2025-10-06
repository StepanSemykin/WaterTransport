namespace WaterTransportService.Model.Entities;

public class CalendarStatus
{
    public required ushort Id { get; set; }
    public required string Name { get; set; } // 1 - запланирован, 2 - в пути, 3 - завершен, 4 - отменен
}
