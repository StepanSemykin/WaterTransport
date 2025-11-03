using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

public class RentOrderService(IEntityRepository<RentOrder, Guid> repo) : IRentOrderService
{
    private readonly IEntityRepository<RentOrder, Guid> _repo = repo;

    public async Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.CreatedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<RentOrderDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto, CancellationToken ct)
    {
        var entity = new RentOrder
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            User = null!,
            TotalPrice = dto.TotalPrice,
            NumberOfPassengers = dto.NumberOfPassengers,
            RentCalendarId = dto.RentCalendarId,
            RentCalendar = null!,
            RentalStartTime = dto.RentalStartTime,
            RentalEndTime = dto.RentalEndTime,
            OrderDate = dto.OrderDate,
            StatusName = dto.StatusName,
            CreatedAt = DateTime.UtcNow,
            CancelledAt = null
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    public async Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.TotalPrice.HasValue) entity.TotalPrice = dto.TotalPrice.Value;
        if (dto.NumberOfPassengers.HasValue) entity.NumberOfPassengers = dto.NumberOfPassengers.Value;
        if (dto.RentCalendarId.HasValue) entity.RentCalendarId = dto.RentCalendarId.Value;
        if (dto.RentalStartTime.HasValue) entity.RentalStartTime = dto.RentalStartTime.Value;
        if (dto.RentalEndTime.HasValue) entity.RentalEndTime = dto.RentalEndTime.Value;
        if (dto.OrderDate.HasValue) entity.OrderDate = dto.OrderDate.Value;
        if (!string.IsNullOrWhiteSpace(dto.StatusName)) entity.StatusName = dto.StatusName;
        if (dto.CancelledAt.HasValue) entity.CancelledAt = dto.CancelledAt.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static RentOrderDto MapToDto(RentOrder e) => new(e.Id, e.UserId, e.TotalPrice, e.NumberOfPassengers, e.RentCalendarId, e.RentalStartTime, e.RentalEndTime, e.OrderDate, e.StatusName, e.CreatedAt, e.CancelledAt);
}
