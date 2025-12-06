namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда данные невалидны.
/// </summary>
public class InvalidDataException : Exception
{
    public string FieldName { get; }
    public object? Value { get; }

    public InvalidDataException(string fieldName, object? value)
        : base($"Невалидное значение для поля '{fieldName}': {value}")
    {
        FieldName = fieldName;
        Value = value;
    }

    public InvalidDataException(string fieldName, object? value, string message)
        : base(message)
    {
        FieldName = fieldName;
        Value = value;
    }

    public InvalidDataException(string fieldName, object? value, string message, Exception innerException)
        : base(message, innerException)
    {
        FieldName = fieldName;
        Value = value;
    }

    public InvalidDataException(string message)
        : base(message)
    {
        FieldName = string.Empty;
        Value = null;
    }
}
