namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// »сключение, выбрасываемое при попытке изменить уже подтвержденный заказ.
/// </summary>
public class OrderAlreadyConfirmedException : Exception
{
    public Guid OrderId { get; }

    public OrderAlreadyConfirmedException(Guid orderId)
        : base($"«аказ {orderId} уже подтвержден и не может быть изменен.")
    {
        OrderId = orderId;
    }

    public OrderAlreadyConfirmedException(Guid orderId, string message)
        : base(message)
    {
        OrderId = orderId;
    }

    public OrderAlreadyConfirmedException(Guid orderId, string message, Exception innerException)
        : base(message, innerException)
    {
        OrderId = orderId;
    }
}
