namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда время аренды уже прошло.
/// </summary>
public class RentalTimePastException : Exception
{
    public Guid OrderId { get; }
    public DateTime RentalTime { get; }

    public RentalTimePastException(Guid orderId, DateTime rentalTime)
        : base($"Время аренды заказа {orderId} ({rentalTime:g}) уже прошло")
    {
        OrderId = orderId;
        RentalTime = rentalTime;
    }

    public RentalTimePastException(Guid orderId, DateTime rentalTime, string message)
        : base(message)
    {
        OrderId = orderId;
        RentalTime = rentalTime;
    }

    public RentalTimePastException(Guid orderId, DateTime rentalTime, string message, Exception innerException)
        : base(message, innerException)
    {
        OrderId = orderId;
        RentalTime = rentalTime;
    }
}
