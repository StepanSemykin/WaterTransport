namespace WaterTransportService.Infrastructure.PasswordValidator;

public interface IPasswordValidator
{
    public bool IsPasswordValid(string password);
}
