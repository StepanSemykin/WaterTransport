namespace WaterTransportService.Api.Middleware.Exceptions;

/// <summary>
/// Исключение, выбрасываемое при попытке использования повторяющегося пароля.
/// </summary>
public class DuplicatePasswordException : Exception
{
    /// <summary>
    /// Создает новый экземпляр исключения с сообщением по умолчанию.
    /// </summary>
    public DuplicatePasswordException()
        : base("Новый пароль не должен совпадать с текущим или ранее использованными паролями.")
    {
    }

    /// <summary>
    /// Создает новый экземпляр исключения с указанным сообщением.
    /// </summary>
    /// <param name="message">Сообщение об ошибке.</param>
    public DuplicatePasswordException(string message)
        : base(message)
    {
    }

    /// <summary>
    /// Создает новый экземпляр исключения с указанным сообщением и внутренним исключением.
    /// </summary>
    /// <param name="message">Сообщение об ошибке.</param>
    /// <param name="innerException">Внутреннее исключение.</param>
    public DuplicatePasswordException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
