namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда партнер пытается дважды откликнуться на один заказ.
/// </summary>
public class DuplicateOfferException : Exception
{
    public Guid PartnerId { get; }
    public Guid OrderId { get; }

    public DuplicateOfferException(Guid partnerId, Guid orderId)
        : base($"Партнер {partnerId} уже откликнулся на заказ {orderId}")
    {
        PartnerId = partnerId;
        OrderId = orderId;
    }

    public DuplicateOfferException(Guid partnerId, Guid orderId, string message)
        : base(message)
    {
        PartnerId = partnerId;
        OrderId = orderId;
    }

    public DuplicateOfferException(Guid partnerId, Guid orderId, string message, Exception innerException)
        : base(message, innerException)
    {
        PartnerId = partnerId;
        OrderId = orderId;
    }
}
