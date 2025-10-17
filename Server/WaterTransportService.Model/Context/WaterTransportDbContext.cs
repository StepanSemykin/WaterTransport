using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Context;

public class WaterTransportDbContext(DbContextOptions<WaterTransportDbContext> options) : DbContext(options)
{
    public required DbSet<User> Users { get; set; }
    public required DbSet<UserProfile> UserProfiles { get; set; }
    public required DbSet<UserImage> UserImages { get; set; }
    public required DbSet<Password> Passwords { get; set; }
    public required DbSet<Role> Roles { get; set; }
    public required DbSet<Ship> Ships { get; set; }
    public required DbSet<ShipType> ShipTypes { get; set; }
    public required DbSet<ShipImage> ShipImages { get; set; }
    public required DbSet<Port> Ports { get; set; }
    public required DbSet<PortType> PortTypes { get; set; }
    public required DbSet<PortImage> PortImages { get; set; }
    public required DbSet<Route> Routes { get; set; }
    public required DbSet<RouteType> RouteTypes { get; set; }
    public required DbSet<Calendar> Calendars { get; set; }
    public required DbSet<CalendarStatus> CalendarStatuses { get; set; }
    public required DbSet<Booking> Bookings { get; set; }
    public required DbSet<BookingStatus> BookingStatuses { get; set; }
    public required DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CalendarStatus>().HasData(
            new CalendarStatus { Id = 1, Name = "Planned" },
            new CalendarStatus { Id = 2, Name = "OnTheWay" },
            new CalendarStatus { Id = 3, Name = "Completed" },
            new CalendarStatus { Id = 4, Name = "Cancelled" },
            new CalendarStatus { Id = 5, Name = "Available" },
            new CalendarStatus { Id = 6, Name = "PartiallyAvailable" },
            new CalendarStatus { Id = 7, Name = "Unavailable" },
            new CalendarStatus { Id = 8, Name = "Blocked" }
        );

        modelBuilder.Entity<PortType>().HasData(
            new PortType { Id = 1, Title = "Marine" },
            new PortType { Id = 2, Title = "Riverine" },
            new PortType { Id = 3, Title = "Estuaries" },
            new PortType { Id = 4, Title = "Riverbed" },
            new PortType { Id = 5, Title = "BucketPools" },
            new PortType { Id = 6, Title = "Closed" },
            new PortType { Id = 7, Title = "FormedByPiers" }
        );

        modelBuilder.Entity<RouteType>().HasData(
            new RouteType { Id = 1, Name = "Rental" },
            new RouteType { Id = 2, Name = "FixedRoute" }
        );

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "User" },
            new Role { Id = 2, Name = "Admin" },
            new Role { Id = 3, Name = "Partner" }
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

        // USER PROFILE (1:1)
        //modelBuilder.Entity<UserProfile>(b =>
        //{
        //    b.HasKey(p => p.UserId);
        //    b.HasOne(p => p.User).WithOne(u => u.UserProfile).HasForeignKey<UserProfile>(p => p.UserId).OnDelete(DeleteBehavior.Cascade);
        //});

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

            b.HasOne(r => r.User)
                .WithMany(u => u.ReceivedReviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull); 

            b.HasOne(r => r.Ship)
                .WithMany(s => s.Reviews)
                .HasForeignKey(r => r.ShipId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}

