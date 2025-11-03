using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Calendars;

public class RentCalendarService(IEntityRepository<RentCalendar, Guid> repo) : IRentCalendarService
{
    private readonly IEntityRepository<RentCalendar, Guid> _repo = repo;

    public async Task<(IReadOnlyList<RentCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.LowerTimeLimit).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<RentCalendarDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<RentCalendarDto?> CreateAsync(CreateRentCalendarDto dto, CancellationToken ct)
    {
        var entity = new RentCalendar
        {
            Id = Guid.NewGuid(),
            ShipId = dto.ShipId,
            Ship = null!,
            LowerTimeLimit = dto.LowerTimeLimit,
            HighTimeLimit = dto.HighTimeLimit
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    public async Task<RentCalendarDto?> UpdateAsync(Guid id, UpdateRentCalendarDto dto, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.ShipId.HasValue) entity.ShipId = dto.ShipId.Value;
        if (dto.LowerTimeLimit.HasValue) entity.LowerTimeLimit = dto.LowerTimeLimit.Value;
        if (dto.HighTimeLimit.HasValue) entity.HighTimeLimit = dto.HighTimeLimit.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static RentCalendarDto MapToDto(RentCalendar e) => new(e.Id, e.ShipId, e.LowerTimeLimit, e.HighTimeLimit);
}
