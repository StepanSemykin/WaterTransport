using WaterTransportService.Model.Entities;

namespace WaterTransportService.Tests;

public class WaterTransportFixture
{
    public WaterTransportData WaterTransportData { get; set; }
    public WaterTransportFixture()
    {
        var users = new List<User>
        {
            new User
            {
                Uuid = Guid.NewGuid(),
                Phone = "+1234567890",
                Nickname = "testuser1",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                IsActive = true
            },
            new User
            {
                Uuid = Guid.NewGuid(),
                Phone = "+0987654321",
                Nickname = "testuser2",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                IsActive = false
            }
        };

        WaterTransportData = new WaterTransportData
        {
            Users = users
        };
              
    }
}
