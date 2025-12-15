namespace WaterTransportService.Api.Middleware.Exceptions;

/// <summary>
/// Исключение, сигнализирующее об использовании уже существующего значения поля.
/// </summary>
public class DuplicateFieldValueException : Exception
{
    /// <summary>
    /// Создает исключение с сообщением, основанным на названии поля и значении.
    /// </summary>
    /// <param name="fieldName">Название поля.</param>
    /// <param name="fieldValue">Конфликтующее значение.</param>
    public DuplicateFieldValueException(string fieldName, string? fieldValue = null)
        : base(ComposeMessage(fieldName, fieldValue))
    {
    }

    private static string ComposeMessage(string fieldName, string? fieldValue)
    {
        var normalizedFieldName = string.IsNullOrWhiteSpace(fieldName) ? "значение" : fieldName;
        return string.IsNullOrWhiteSpace(fieldValue)
            ? $"Пользователь с таким {normalizedFieldName} уже существует."
            : $"Пользователь с {normalizedFieldName}: {fieldValue} уже существует.";
    }
}
