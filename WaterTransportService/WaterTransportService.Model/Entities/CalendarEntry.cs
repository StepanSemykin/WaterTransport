namespace WaterTransportService.WaterTransportService.Model.Entities;

public class CalendarEntry
{
    public int CalendarEntryId { get; set; }

    public int ShipId { get; set; }
    public Ship Ship { get; set; }

    public DateTime Date { get; set; }
    public string Status { get; set; }   // Available, Booked, Blocked, Partial
}
