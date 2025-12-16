using Microsoft.EntityFrameworkCore;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Model.Context;

public class WaterTransportDbContext(DbContextOptions<WaterTransportDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UserProfile> UserProfiles { get; set; } = null!;
    public DbSet<UserImage> UserImages { get; set; } = null!;
    public DbSet<Ship> Ships { get; set; } = null!;
    public DbSet<ShipType> ShipTypes { get; set; } = null!;
    public DbSet<ShipImage> ShipImages { get; set; } = null!;
    public DbSet<Port> Ports { get; set; } = null!;
    public DbSet<PortType> PortTypes { get; set; } = null!;
    public DbSet<PortImage> PortImages { get; set; } = null!;
    public DbSet<RentOrder> RentOrders { get; set; } = null!;
    public DbSet<RentOrderOffer> RentOrderOffers { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<OldPassword> OldPasswords { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<ShipRentalCalendar> ShipRentalCalendars { get; set; } = null!;

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

        modelBuilder.Entity<ShipRentalCalendar>(b =>
        {
            b.HasOne(src => src.Ship)
                .WithMany(s => s.RentalCalendarEntries)
                .HasForeignKey(src => src.ShipId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(src => src.RentOrder)
                .WithOne(ro => ro.ShipRentalCalendarEntry)
                .HasForeignKey<ShipRentalCalendar>(src => src.RentOrderId)
                .OnDelete(DeleteBehavior.Cascade);
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