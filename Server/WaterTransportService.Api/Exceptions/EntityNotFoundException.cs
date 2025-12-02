namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда сущность не найдена.
/// </summary>
public class EntityNotFoundException : Exception
{
    public string EntityType { get; }
    public object EntityId { get; }

    public EntityNotFoundException(string entityType, object entityId)
        : base($"{entityType} с ID {entityId} не найден")
    {
        EntityType = entityType;
        EntityId = entityId;
    }

    public EntityNotFoundException(string entityType, object entityId, string message)
        : base(message)
    {
        EntityType = entityType;
        EntityId = entityId;
    }

    public EntityNotFoundException(string entityType, object entityId, string message, Exception innerException)
        : base(message, innerException)
    {
        EntityType = entityType;
        EntityId = entityId;
    }
}
