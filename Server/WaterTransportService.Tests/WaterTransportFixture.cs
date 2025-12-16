using WaterTransportService.Model.Entities;
namespace WaterTransportService.Tests;

public class WaterTransportFixture
{
    public WaterTransportData WaterTransportData { get; set; }
    public WaterTransportFixture()
    {
        var users = new List<User>
        {
            new() {
                Id = Guid.NewGuid(),
                Phone = "+1234567890",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                Hash = "hashedpassword1",
                IsActive = true
            },
            new() {
                Id = Guid.NewGuid(),
                Phone = "+0987654321",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                Hash = "hashpassword2",
                IsActive = false
            }
        };

        WaterTransportData = new WaterTransportData
        {
            Users = users
        };

    }
}
