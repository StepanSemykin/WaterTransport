using WaterTransportService.Model.Entities;

namespace WaterTransportService.Tests;

public class WaterTransportTests(WaterTransportFixture fixture) : IClassFixture<WaterTransportFixture>
{
    private readonly WaterTransportFixture _fixture = fixture;

    [Fact]
    public void TestAddUser()
    {
        var usersBefore = _fixture.WaterTransportData.Users.Count;

        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Phone = "+1111111111",
            CreatedAt = DateTime.UtcNow,
            Hash = "testhash",
            IsActive = true
        };

        _fixture.WaterTransportData.Users.Add(newUser);

        Assert.Equal(usersBefore + 1, _fixture.WaterTransportData.Users.Count);
        Assert.Contains(_fixture.WaterTransportData.Users, u => u.Id == newUser.Id);
    }

    [Fact]
    public void TestGetActiveUsers()
    {
        var activeUsers = _fixture.WaterTransportData.Users.Where(u => u.IsActive).ToList();

        Assert.NotEmpty(activeUsers);
        Assert.All(activeUsers, u => Assert.True(u.IsActive));
    }
}