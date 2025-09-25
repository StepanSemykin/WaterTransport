namespace WaterTransportService.WaterTransportService.Model.Entities;

public class SupportTicket
{
    public int TicketId { get; set; }
    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; }

    public Guid? AssignedToId { get; set; } // оператор поддержки
    public User AssignedTo { get; set; }

    public string Category { get; set; }    // например: Payments, Booking, Technical
    public string Status { get; set; }      // Open, InProgress, Resolved
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<ChatMessage> Messages { get; set; }
}
