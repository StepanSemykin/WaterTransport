using System;
using System.Linq;
using WaterTransportService.Model.Entities;
using Xunit;

namespace WaterTransportService.Tests;

public class WaterTransportTests : IClassFixture<WaterTransportFixture>
{
    private readonly WaterTransportFixture _fixture;

    public WaterTransportTests(WaterTransportFixture fixture) => _fixture = fixture;

    [Fact]
    public void TestAddUser()
    {
        var usersBefore = _fixture.WaterTransportData.Users.Count;

        var newUser = new User
        {
            Uuid = Guid.NewGuid(),
            Phone = "+1111111111",
            Nickname = "newuser",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _fixture.WaterTransportData.Users.Add(newUser);

        Assert.Equal(usersBefore + 1, _fixture.WaterTransportData.Users.Count);
        Assert.Contains(_fixture.WaterTransportData.Users, u => u.Uuid == newUser.Uuid);
    }

    [Fact]
    public void TestGetActiveUsers()
    {
        var activeUsers = _fixture.WaterTransportData.Users.Where(u => u.IsActive).ToList();

        Assert.NotEmpty(activeUsers);
        Assert.All(activeUsers, u => Assert.True(u.IsActive));
    }
}