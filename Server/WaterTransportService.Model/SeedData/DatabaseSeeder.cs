using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Context;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.SeedData;

/// <summary>
/// Класс для добавления данных в базу данных.
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
    /// Добавляет типы портов в базу данных.
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    public static async Task SeedPortTypesAsync(WaterTransportDbContext context)
    {
        if (await context.PortTypes.AnyAsync())
        {
            Console.WriteLine("Типы портов уже существуют.");
            return;
        }

        var portTypes = new[]
        {
            new PortType { Id = 1, Title = "Морской" },
            new PortType { Id = 2, Title = "Речной" },
            new PortType { Id = 3, Title = "Эстуарный" },
            new PortType { Id = 4, Title = "Русловой" },
            new PortType { Id = 5, Title = "Бассейновый" },
            new PortType { Id = 6, Title = "Закрытый" },
            new PortType { Id = 7, Title = "Пирсовый" }
        };

        await context.PortTypes.AddRangeAsync(portTypes);
        await context.SaveChangesAsync();
        Console.WriteLine("Типы портов успешно добавлены.");
    }

    /// <summary>
    /// Добавляет типы судов в базу данных.
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    public static async Task SeedShipTypesAsync(WaterTransportDbContext context)
    {
        if (await context.ShipTypes.AnyAsync())
        {
            Console.WriteLine("Типы судов уже существуют.");
            return;
        }

        var shipTypes = new[]
        {
            new ShipType { Id = 1, Name = "Яхта" },
            new ShipType { Id = 2, Name = "Парусная лодка" },
            new ShipType { Id = 3, Name = "Моторная лодка" },
            new ShipType { Id = 4, Name = "Паром" },
            new ShipType { Id = 5, Name = "Гидроцикл" },
            new ShipType { Id = 6, Name = "Баржа" },
            new ShipType { Id = 7, Name = "Буксир" },
            new ShipType { Id = 8, Name = "Резиновая лодка" }
        };

        await context.ShipTypes.AddRangeAsync(shipTypes);
        await context.SaveChangesAsync();
        Console.WriteLine("Типы судов успешно добавлены.");
    }

    /// <summary>
    /// Добавляет порты в базу данных (статические данные из HasData).
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    public static async Task SeedPortsAsync(WaterTransportDbContext context)
    {
        if (await context.Ports.AnyAsync())
        {
            Console.WriteLine("Порты уже существуют.");
            return;
        }

        var portTypes = await context.PortTypes.ToListAsync();
        var riverineType = portTypes.FirstOrDefault(pt => pt.Id == 2);

        if (riverineType == null)
        {
            Console.WriteLine("Ошибка: тип портов 'Речной' не найден. Сначала добавьте типы портов.");
            return;
        }

        var ports = new List<Port>
        {
            new() {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Title = "Дебаркадер Старая пристань",
                PortTypeId = 2,
                PortType = riverineType,
                Latitude = 53.202203,
                Longitude = 50.097634,
                Address = "Городской округ Самара, Ленинский район"
            },
            new() {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Title = "Пристань ФАУ МО РФ ЦСКА",
                PortTypeId = 2,
                PortType = riverineType,
                Latitude = 53.205553,
                Longitude = 50.105008,
                Address = "Городской округ Самара, Ленинский район"
            },
            new() {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title = "Речной вокзал Самара – причал СВП",
                PortTypeId = 2,
                PortType = riverineType,
                Latitude = 53.188515,
                Longitude = 50.079847,
                Address = "Городской округ Самара, Самарский район"
            },
            new() {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Title = "Речной вокзал Самара – причал №1",
                PortTypeId = 2,
                PortType = riverineType,
                Latitude = 53.189053,
                Longitude = 50.078383,
                Address = "Городской округ Самара, Самарский район"
            }
        };

        await context.Ports.AddRangeAsync(ports);
        await context.SaveChangesAsync();
        Console.WriteLine("Порты успешно добавлены.");
    }

    /// <summary>
    /// Добавляет изображения портов в базу данных (статические данные из HasData).
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    public static async Task SeedPortImagesAsync(WaterTransportDbContext context)
    {
        if (await context.PortImages.AnyAsync())
        {
            Console.WriteLine("Изображения портов уже существуют.");
            return;
        }

        var portImages = new List<PortImage>
        {
            new()
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                PortId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Port = null!,
                ImagePath = "Images/Ports/30672607-23ef-41a8-b005-39b8ff78021f.jpg",
                IsPrimary = true,
                UploadedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                PortId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Port = null!,
                ImagePath = "Images/Ports/35eb072a-42bd-4f59-aeed-cdf3607bcaf1.jpg",
                IsPrimary = true,
                UploadedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                PortId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Port = null!,
                ImagePath = "Images/Ports/5a57b2d1-309a-4bba-a225-4d043f39c8e3.jpg",
                IsPrimary = true,
                UploadedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                PortId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Port = null!,
                ImagePath = "Images/Ports/42af05e2-513b-4159-8898-c65800dd1a14.jpg",
                IsPrimary = true,
                UploadedAt = DateTime.UtcNow
            }
        };

        await context.PortImages.AddRangeAsync(portImages);
        await context.SaveChangesAsync();
        Console.WriteLine("Изображения портов успешно добавлены.");
    }

    /// <summary>
    /// Добавляет тестовые данные в базу данных (пользователи, профили, суда).
    /// </summary>
    /// <param name="context">Контекст базы данных.</param>
    /// <param name="passwordHash">Хеш пароля для тестовых пользователей.</param>
    public static async Task SeedAsync(WaterTransportDbContext context, string passwordHash = null)
    {
        if (await context.Users.AnyAsync(u => u.Role == "common" || u.Role == "partner"))
        {
            Console.WriteLine("Тестовые данные уже существуют.");
            return;
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
        if (!ports.Any())
        {
            Console.WriteLine("Ошибка: порты не найдены. Сначала добавьте порты.");
            return;
        }

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

    private static async Task<List<Ship>> CreateShipsAsync(WaterTransportDbContext context, List<User> partnerUsers, List<Port> ports)
    {
        var shipTypes = await context.ShipTypes.ToListAsync();
        if (!shipTypes.Any())
        {
            Console.WriteLine("Ошибка: типы судов не найдены. Сначала добавьте типы судов.");
            return new List<Ship>();
        }

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