namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// »сключение, выбрасываемое при попытке использовани€ повтор€ющегос€ парол€.
/// </summary>
public class DuplicatePasswordException : Exception
{
    /// <summary>
    /// —оздает новый экземпл€р исключени€ с сообщением по умолчанию.
    /// </summary>
    public DuplicatePasswordException()
        : base("Ќовый пароль не должен совпадать с текущим или ранее использованными парол€ми.")
    {
    }

    /// <summary>
    /// —оздает новый экземпл€р исключени€ с указанным сообщением.
    /// </summary>
    /// <param name="message">—ообщение об ошибке.</param>
    public DuplicatePasswordException(string message)
        : base(message)
    {
    }

    /// <summary>
    /// —оздает новый экземпл€р исключени€ с указанным сообщением и внутренним исключением.
    /// </summary>
    /// <param name="message">—ообщение об ошибке.</param>
    /// <param name="innerException">¬нутреннее исключение.</param>
    public DuplicatePasswordException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
