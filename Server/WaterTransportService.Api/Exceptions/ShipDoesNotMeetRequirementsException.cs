namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда судно не соответствует требованиям заказа.
/// </summary>
public class ShipDoesNotMeetRequirementsException : Exception
{
    public Guid ShipId { get; }
    public Guid OrderId { get; }
    public string Reason { get; }

    public ShipDoesNotMeetRequirementsException(Guid shipId, Guid orderId, string reason)
        : base($"Судно {shipId} не соответствует требованиям заказа {orderId}. Причина: {reason}")
    {
        ShipId = shipId;
        OrderId = orderId;
        Reason = reason;
    }

    public ShipDoesNotMeetRequirementsException(Guid shipId, Guid orderId, string reason, string message)
        : base(message)
    {
        ShipId = shipId;
        OrderId = orderId;
        Reason = reason;
    }
}
