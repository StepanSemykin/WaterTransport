using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Context;

public class WaterTransportDbContext(DbContextOptions<WaterTransportDbContext> options) : DbContext(options)
{
    public required DbSet<User> Users { get; set; }
    public required DbSet<UserProfile> UserProfiles { get; set; }
    public required DbSet<UserImage> UserImages { get; set; }
    public required DbSet<Ship> Ships { get; set; }
    public required DbSet<ShipType> ShipTypes { get; set; }
    public required DbSet<ShipImage> ShipImages { get; set; }
    public required DbSet<Port> Ports { get; set; }
    public required DbSet<PortType> PortTypes { get; set; }
    public required DbSet<PortImage> PortImages { get; set; }
    public required DbSet<Route> Routes { get; set; }
    public required DbSet<RegularCalendar> RegularCalendars { get; set; }
    public required DbSet<RegularOrder> RegularOrders { get; set; }
    public required DbSet<RentOrder> RentOrders { get; set; }
    public required DbSet<RentOrderOffer> RentOrderOffers { get; set; }
    public required DbSet<Review> Reviews { get; set; }
    public required DbSet<OldPassword> OldPasswords { get; set; }
    public required DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RentOrder>(b =>
        {
            b.HasOne(ro => ro.User)
                .WithMany(u => u.RentOrders)
                .HasForeignKey(ro => ro.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(ro => ro.Partner)
                .WithMany()
                .HasForeignKey(ro => ro.PartnerId)
                .OnDelete(DeleteBehavior.SetNull);

            b.HasOne(ro => ro.Ship)
                .WithMany()
                .HasForeignKey(ro => ro.ShipId)
                .OnDelete(DeleteBehavior.SetNull);

            b.HasOne(ro => ro.ShipType)
                .WithMany()
                .HasForeignKey(ro => ro.ShipTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(ro => ro.DeparturePort)
                .WithMany()
                .HasForeignKey(ro => ro.DeparturePortId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(ro => ro.ArrivalPort)
                .WithMany()
                .HasForeignKey(ro => ro.ArrivalPortId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<RentOrderOffer>(b =>
        {
            b.HasOne(roo => roo.RentOrder)
                .WithMany(ro => ro.Offers)
                .HasForeignKey(roo => roo.RentOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(roo => roo.Partner)
                .WithMany()
                .HasForeignKey(roo => roo.PartnerId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(roo => roo.Ship)
                .WithMany()
                .HasForeignKey(roo => roo.ShipId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PortType>().HasData(
            new PortType { Id = 1, Title = "Marine" },
            new PortType { Id = 2, Title = "Riverine" },
            new PortType { Id = 3, Title = "Estuaries" },
            new PortType { Id = 4, Title = "Riverbed" },
            new PortType { Id = 5, Title = "BucketPools" },
            new PortType { Id = 6, Title = "Closed" },
            new PortType { Id = 7, Title = "FormedByPiers" }
        );

        modelBuilder.Entity<ShipType>().HasData(
            new ShipType { Id = 1, Name = "Yacht" },
            new ShipType { Id = 2, Name = "Sailboat" },
            new ShipType { Id = 3, Name = "Motorboat" },
            new ShipType { Id = 4, Name = "Ferry" },
            new ShipType { Id = 5, Name = "JetSki" },
            new ShipType { Id = 6, Name = "Barge" },
            new ShipType { Id = 7, Name = "Tugboat" },
            new ShipType { Id = 8, Name = "RubberDinghy" }
        );

        modelBuilder.Entity<Port>().HasData(
            new Port
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Title = "Дебаркадер Старая пристань",
                PortTypeId = 2,
                PortType = null!,
                Latitude = 53.202203,
                Longitude = 50.097634,
                Address = "Городской округ Самара, Ленинский район"
            },
            new Port
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Title = "Пристань ФАУ МО РФ ЦСКА",
                PortTypeId = 2,
                PortType = null!,
                Latitude = 53.205553,
                Longitude = 50.105008,
                Address = "Городской округ Самара, Ленинский район"
            },
            new Port
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title = "Речной вокзал Самара – причал СВП",
                PortTypeId = 2,
                PortType = null!,
                Latitude = 53.188515,
                Longitude = 50.079847,
                Address = "Городской округ Самара, Самарский район"
            },
            new Port
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Title = "Речной вокзал Самара – причал №1",
                PortTypeId = 2,
                PortType = null!,
                Latitude = 53.189053,
                Longitude = 50.078383,
                Address = "Городской округ Самара, Самарский район"
            }
        );

        modelBuilder.Entity<Route>(b =>
        {
            b.HasOne(r => r.FromPort)
                .WithMany()
                .HasForeignKey(r => r.FromPortId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(r => r.ToPort)
                .WithMany()
                .HasForeignKey(r => r.ToPortId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Review>(b =>
        {
            b.HasOne(r => r.Author)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(r => r.RentOrder)
                .WithMany(ro => ro.Reviews)
                .HasForeignKey(r => r.RentOrderId)
                .OnDelete(DeleteBehavior.SetNull);

            b.HasOne<User>()
                .WithMany(u => u.ReceivedReviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            b.HasOne<Ship>()
                .WithMany(s => s.Reviews)
                .HasForeignKey(r => r.ShipId)
                .OnDelete(DeleteBehavior.SetNull);

            b.HasOne<Port>()
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PortId)
                .OnDelete(DeleteBehavior.SetNull);
        });


        modelBuilder.Entity<ShipImage>(b =>
        {
            b.HasOne(si => si.Ship)
                .WithMany(s => s.ShipImages)
                .HasForeignKey(si => si.ShipId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PortImage>(b =>
        {
            b.HasOne(pi => pi.Port)
                .WithMany(p => p.PortImages)
                .HasForeignKey(pi => pi.PortId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserImage>(b =>
        {
            b.HasOne(ui => ui.UserProfile)
                .WithMany(up => up.UserImages)
                .HasForeignKey(ui => ui.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

