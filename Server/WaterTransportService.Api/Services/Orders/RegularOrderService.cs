using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

public class RegularOrderService(IEntityRepository<RegularOrder, Guid> repo) : IRegularOrderService
{
    private readonly IEntityRepository<RegularOrder, Guid> _repo = repo;

    public async Task<(IReadOnlyList<RegularOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.CreatedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<RegularOrderDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<RegularOrderDto?> CreateAsync(CreateRegularOrderDto dto, CancellationToken ct)
    {
        var entity = new RegularOrder
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            User = null!,
            TotalPrice = dto.TotalPrice,
            NumberOfPassengers = dto.NumberOfPassengers,
            RegularCalendarId = dto.RegularCalendarId,
            RegularCalendar = null!,
            OrderDate = dto.OrderDate,
            StatusName = dto.StatusName,
            CreatedAt = DateTime.UtcNow,
            CancelledAt = null
        };
        var created = await _repo.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<RegularOrderDto?> UpdateAsync(Guid id, UpdateRegularOrderDto dto, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.TotalPrice.HasValue) entity.TotalPrice = dto.TotalPrice.Value;
        if (dto.NumberOfPassengers.HasValue) entity.NumberOfPassengers = dto.NumberOfPassengers.Value;
        if (dto.RegularCalendarId.HasValue) entity.RegularCalendarId = dto.RegularCalendarId.Value;
        if (dto.OrderDate.HasValue) entity.OrderDate = dto.OrderDate.Value;
        if (!string.IsNullOrWhiteSpace(dto.StatusName)) entity.StatusName = dto.StatusName;
        if (dto.CancelledAt.HasValue) entity.CancelledAt = dto.CancelledAt.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static RegularOrderDto MapToDto(RegularOrder e) => new(e.Id, e.UserId, e.TotalPrice, e.NumberOfPassengers, e.RegularCalendarId, e.OrderDate, e.StatusName, e.CreatedAt, e.CancelledAt);
}
