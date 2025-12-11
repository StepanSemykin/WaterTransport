namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда пользователь не найден в системе.
/// </summary>
public class UserNotFoundException : Exception
{
    public Guid UserId { get; }

    public UserNotFoundException(Guid userId)
        : base($"Пользователь с ID {userId} не найден")
    {
        UserId = userId;
    }

    public UserNotFoundException(Guid userId, string message)
        : base(message)
    {
        UserId = userId;
    }

    public UserNotFoundException(Guid userId, string message, Exception innerException)
        : base(message, innerException)
    {
        UserId = userId;
    }
}
