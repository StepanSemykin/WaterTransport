namespace WaterTransportService.WaterTransportService.Model.Entities;

public class ChatMessage
{
    public int MessageId { get; set; }

    public Guid SenderId { get; set; }
    public User Sender { get; set; }

    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }

    public int? TicketId { get; set; }
    public SupportTicket Ticket { get; set; }

    public string Text { get; set; }
    public DateTime SentAt { get; set; }
}
