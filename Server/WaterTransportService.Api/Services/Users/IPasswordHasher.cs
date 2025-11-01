namespace WaterTransportService.Api.Services.Users;

public interface IPasswordHasher
{
    string Generate(string password);
    bool Verify(string password, string hash);
}
