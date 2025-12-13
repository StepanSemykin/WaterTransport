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
    /// Создаёт администратора системы, если он ещё не существует.
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    /// <param name="passwordHash">Хеш пароля администратора.</param>
    /// <param name="phone">Номер телефона администратора.</param>
    public static async Task SeedAdminAsync(WaterTransportDbContext context, string passwordHash, string phone)
    {
        // Проверяем, есть ли уже администратор
        if (await context.Users.AnyAsync(u => u.Role == "admin"))
        {
            Console.WriteLine("Администратор уже существует.");
            return;
        }

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Phone = phone,
            Role = "admin",
            IsActive = true,
            Hash = passwordHash,
            CreatedAt = DateTime.UtcNow,
            FailedLoginAttempts = 0
        };

        await context.Users.AddAsync(adminUser);
        await context.SaveChangesAsync();

        var adminProfile = new UserProfile
        {
            UserId = adminUser.Id,
            FirstName = "Администратор",
            LastName = "Системы",
            Patronymic = null,
            Email = null,
            Birthday = null,
            About = "Администратор сервиса водного транспорта",
            Location = null,
            IsPublic = false,
            Nickname = "admin",
            UpdatedAt = DateTime.UtcNow
        };

        await context.UserProfiles.AddAsync(adminProfile);
        await context.SaveChangesAsync();

        Console.WriteLine($"Администратор успешно создан. Телефон: {phone}");
    }

    /// <summary>
    /// Добавляет тестовые данные в базу данных.
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    /// <param name="passwordHash">Хеш пароля для всех тестовых пользователей.</param>
    public static async Task SeedAsync(WaterTransportDbContext context, string passwordHash = null)
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

        var ports = await context.Ports.ToListAsync();

        await CreateShipsAsync(context, partnerUsers, ports);

        Console.WriteLine("Синтетические данные успешно добавлены в базу данных.");
    }

    private static List<User> CreateCommonUsers(string passwordHash)
    {
        var users = new List<User>();
        var now = DateTime.UtcNow;

        var commonUserData = new[]
        {
            "+79001234567",
            "+79001234568",
            "+79001234569",
            "+79001234570",
            "+79001234571"
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
            "+79101234567",
            "+79101234568",
            "+79101234569",
            "+79101234570"
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
                Title = "Дебаркадер Старая пристань",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 53.202203,
                Longitude = 50.097634,
                Address = "Городской округ Самара, Ленинский район"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Пристань ФАУ МО РФ ЦСКА",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 53.205553,
                Longitude = 50.105008,
                Address = "Городской округ Самара, Ленинский район"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Речной вокзал Самара – причал СВП",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 53.188515,
                Longitude = 50.079847,
                Address = "Городской округ Самара, Самарский район"
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Речной вокзал Самара – причал №1",
                PortTypeId = 2,
                PortType = riverineType!,
                Latitude = 53.189053,
                Longitude = 50.078383,
                Address = "Городской округ Самара, Самарский район"
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
