using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.SeedData;

/// <summary>
/// Класс для добавления синтетических данных в базу данных.
/// </summary>
public static class DatabaseSeeder
{
    /// <summary>
    /// Добавляет тестовые данные в базу данных.
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    /// <param name="passwordHash">Хеш пароля для всех тестовых пользователей.</param>
    public static async Task SeedAsync(WaterTransportDbContext context, string passwordHash)
    {
        // Проверяем, есть ли уже данные
        if (context.Users.Any())
        {
            return; // БД уже заполнена
        }

        var commonUsers = CreateCommonUsers(passwordHash);
        var partnerUsers = CreatePartnerUsers(passwordHash);
        var allUsers = commonUsers.Concat(partnerUsers).ToList();

        await context.Users.AddRangeAsync(allUsers);
        await context.SaveChangesAsync();

        var userProfiles = CreateUserProfiles(allUsers);
        await context.UserProfiles.AddRangeAsync(userProfiles);
        await context.SaveChangesAsync();

        var ports = await CreatePortsAsync(context);

        await CreateShipsAsync(context, partnerUsers, ports);

        Console.WriteLine("Синтетические данные успешно добавлены в базу данных.");
    }

    private static List<User> CreateCommonUsers(string passwordHash)
    {
        var users = new List<User>();
        var now = DateTime.UtcNow;

        var commonUserData = new[]
        {
            "79001234567",
            "79001234568",
            "79001234569",
            "79001234570",
            "79001234571"
        };

        foreach (var phone in commonUserData)
        {
            users.Add(new User
            {
                Id = Guid.NewGuid(),
                Phone = phone,
                CreatedAt = now.AddDays(-Random.Shared.Next(30, 365)),
                LastLoginAt = now.AddDays(-Random.Shared.Next(1, 30)),
                IsActive = true,
                FailedLoginAttempts = 0,
                LockedUntil = null,
                Role = "common",
                Hash = passwordHash
            });
        }

        return users;
    }

    private static List<User> CreatePartnerUsers(string passwordHash)
    {
        var users = new List<User>();
        var now = DateTime.UtcNow;

        var partnerUserData = new[]
        {
            "79101234567",
            "79101234568",
            "79101234569",
            "79101234570"
        };

        foreach (var phone in partnerUserData)
        {
            users.Add(new User
            {
                Id = Guid.NewGuid(),
                Phone = phone,
                CreatedAt = now.AddDays(-Random.Shared.Next(30, 365)),
                LastLoginAt = now.AddDays(-Random.Shared.Next(1, 30)),
                IsActive = true,
                FailedLoginAttempts = 0,
                LockedUntil = null,
                Role = "partner",
                Hash = passwordHash
            });
        }

        return users;
    }

    private static List<UserProfile> CreateUserProfiles(List<User> users)
    {
        var profiles = new List<UserProfile>();
        var now = DateTime.UtcNow;

        var firstNames = new[] { "Иван", "Петр", "Сидор", "Алексей", "Мария", "Дмитрий", "Андрей", "Сергей", "Ольга" };
        var lastNames = new[] { "Иванов", "Петров", "Сидоров", "Кузнецов", "Смирнова", "Попов", "Соколов", "Морозов", "Федорова" };
        var locations = new[] { "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород", "Самара", "Владивосток" };

        foreach (var user in users)
        {
            profiles.Add(new UserProfile
            {
                UserId = user.Id,
                User = user,
                Nickname = null,
                FirstName = firstNames[Random.Shared.Next(firstNames.Length)],
                LastName = lastNames[Random.Shared.Next(lastNames.Length)],
                Patronymic = "Иванович",
                Email = $"{user.Phone.Replace("+", "").Replace(" ", "")}@example.com",
                Birthday = DateTime.UtcNow.AddYears(-Random.Shared.Next(18, 65)).Date,
                About = user.Role == "partner"
                    ? "Профессиональный поставщик услуг водного транспорта"
                    : "Люблю водные прогулки и путешествия",
                Location = locations[Random.Shared.Next(locations.Length)],
                IsPublic = true,
                UpdatedAt = now
            });
        }

        return profiles;
    }

    private static async Task<List<Port>> CreatePortsAsync(WaterTransportDbContext context)
    {
        var portTypes = await context.PortTypes.ToListAsync();
        var marineType = portTypes.FirstOrDefault(pt => pt.Id == 1);
        var riverineType = portTypes.FirstOrDefault(pt => pt.Id == 2);
        var closedType = portTypes.FirstOrDefault(pt => pt.Id == 6);

        var ports = new List<Port>
        {
            new() {
                Id = Guid.NewGuid(),
                Title = "Речной вокзал Москва",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 55.8088,
                Longitude = 37.4863,
                Address = "Ленинградское шоссе, 51, Москва"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Морской вокзал Сочи",
                PortTypeId = 1,
                PortType = marineType!,
                Latitude = 43.5810,
                Longitude = 39.7207,
                Address = "Войкова, 1, Сочи"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Речной порт Санкт-Петербург",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 59.9504,
                Longitude = 30.4829,
                Address = "Проспект Обуховской Обороны, 195, Санкт-Петербург"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Морской порт Владивосток",
                PortTypeId = 1,
                PortType = marineType!,
                Latitude = 43.1155,
                Longitude = 131.8855,
                Address = "Нижнепортовая, 1, Владивосток"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Речной вокзал Нижний Новгород",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 56.3274,
                Longitude = 44.0063,
                Address = "Нижне-Волжская набережная, 1, Нижний Новгород"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Морской порт Новороссийск",
                PortTypeId = 1,
                PortType = marineType!,
                Latitude = 44.7174,
                Longitude = 37.7715,
                Address = "Портовая, 14, Новороссийск"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Речной порт Казань",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 55.7906,
                Longitude = 49.1207,
                Address = "Девятаева, 1, Казань"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Яхт-клуб Стрелка",
                PortTypeId = 6,
                PortType = closedType!,
                Latitude = 56.3152,
                Longitude = 43.9924,
                Address = "Стрелка, Нижний Новгород"
            }
        };

        await context.Ports.AddRangeAsync(ports);
        await context.SaveChangesAsync();

        return ports;
    }

    private static async Task<List<Ship>> CreateShipsAsync(WaterTransportDbContext context, List<User> partnerUsers, List<Port> ports)
    {
        var shipTypes = await context.ShipTypes.ToListAsync();
        var ships = new List<Ship>();
        var now = DateTime.UtcNow;

        var shipNames = new[]
        {
            "Алые паруса", "Волна", "Дельфин", "Жемчужина", "Звезда",
            "Капитан", "Ласточка", "Мечта", "Нептун", "Океан",
            "Пегас", "Радуга", "Сапфир", "Титан", "Удача",
            "Фортуна", "Чайка", "Шторм", "Экспресс", "Янтарь"
        };

        var descriptions = new[]
        {
            "Комфортабельное судно для прогулок и экскурсий",
            "Современный катер с панорамными окнами",
            "Элегантная яхта для особых мероприятий",
            "Быстроходное судно для речных круизов",
            "Уютный катер для семейного отдыха",
            "Вместительный паром для групповых туров",
            "Спортивный катер для активного отдыха",
            "Роскошная яхта класса люкс"
        };

        var registrationCounter = 1000;

        foreach (var partner in partnerUsers)
        {
            var shipsCount = Random.Shared.Next(2, 6);

            for (int i = 0; i < shipsCount; i++)
            {
                var port = ports[Random.Shared.Next(ports.Count)];
                var shipType = shipTypes[Random.Shared.Next(shipTypes.Count)];
                var yearOffset = Random.Shared.Next(1, 20);

                ships.Add(new Ship
                {
                    Id = Guid.NewGuid(),
                    Name = shipNames[Random.Shared.Next(shipNames.Length)] + $" {registrationCounter}",
                    ShipTypeId = shipType.Id,
                    ShipType = shipType,
                    Capacity = (ushort)Random.Shared.Next(6, 151),
                    RegistrationNumber = $"RU{registrationCounter++:D7}",
                    YearOfManufacture = now.AddYears(-yearOffset),
                    MaxSpeed = (ushort)Random.Shared.Next(15, 61),
                    Width = (ushort)Random.Shared.Next(2, 11),
                    Length = (ushort)Random.Shared.Next(6, 41),
                    Description = descriptions[Random.Shared.Next(descriptions.Length)],
                    CostPerHour = (uint)(Random.Shared.Next(30, 501) * 100),
                    PortId = port.Id,
                    Port = port,
                    UserId = partner.Id,
                    User = partner
                });
            }
        }

        await context.Ships.AddRangeAsync(ships);
        await context.SaveChangesAsync();

        return ships;
    }
}
