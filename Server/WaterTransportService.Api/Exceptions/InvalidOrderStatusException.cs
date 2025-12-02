namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// »сключение, выбрасываемое когда заказ находитс€ в неправильном статусе дл€ выполнени€ операции.
/// </summary>
public class InvalidOrderStatusException : Exception
{
    public Guid OrderId { get; }
    public string CurrentStatus { get; }
    public string RequiredStatus { get; }

    public InvalidOrderStatusException(Guid orderId, string currentStatus, string requiredStatus)
        : base($"«аказ {orderId} имеет статус '{currentStatus}', требуетс€ '{requiredStatus}'")
    {
        OrderId = orderId;
        CurrentStatus = currentStatus;
        RequiredStatus = requiredStatus;
    }

    public InvalidOrderStatusException(Guid orderId, string currentStatus, string requiredStatus, string message)
        : base(message)
    {
        OrderId = orderId;
        CurrentStatus = currentStatus;
        RequiredStatus = requiredStatus;
    }
}
