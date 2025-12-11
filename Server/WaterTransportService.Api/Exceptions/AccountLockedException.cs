namespace WaterTransportService.Api.Exceptions;

/// <summary>
/// Исключение, выбрасываемое когда аккаунт заблокирован.
/// </summary>
public class AccountLockedException : Exception
{
    public Guid UserId { get; }
    public DateTime? LockedUntil { get; }

    public AccountLockedException(Guid userId, DateTime? lockedUntil)
        : base(lockedUntil.HasValue
            ? $"Аккаунт {userId} заблокирован до {lockedUntil.Value:g}"
            : $"Аккаунт {userId} заблокирован")
    {
        UserId = userId;
        LockedUntil = lockedUntil;
    }

    public AccountLockedException(Guid userId, DateTime? lockedUntil, string message)
        : base(message)
    {
        UserId = userId;
        LockedUntil = lockedUntil;
    }

    public AccountLockedException(Guid userId, DateTime? lockedUntil, string message, Exception innerException)
        : base(message, innerException)
    {
        UserId = userId;
        LockedUntil = lockedUntil;
    }
}
