using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Calendars;

public class RegularCalendarService(IEntityRepository<RegularCalendar, Guid> repo) : IRegularCalendarService
{
    private readonly IEntityRepository<RegularCalendar, Guid> _repo = repo;

    public async Task<(IReadOnlyList<RegularCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.DepartureAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    public async Task<RegularCalendarDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    public async Task<RegularCalendarDto?> CreateAsync(CreateRegularCalendarDto dto, CancellationToken ct)
    {
        var entity = new RegularCalendar
        {
            Id = Guid.NewGuid(),
            RouteId = dto.RouteId,
            Route = null!,
            DepartureAt = dto.DepartureAt,
            ArrivedAt = dto.ArrivedAt,
            UserId = dto.UserId,
            User = null!,
            StatusName = dto.StatusName
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    public async Task<RegularCalendarDto?> UpdateAsync(Guid id, UpdateRegularCalendarDto dto, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.RouteId.HasValue) entity.RouteId = dto.RouteId.Value;
        if (dto.DepartureAt.HasValue) entity.DepartureAt = dto.DepartureAt.Value;
        if (dto.ArrivedAt.HasValue) entity.ArrivedAt = dto.ArrivedAt.Value;
        if (dto.UserId.HasValue) entity.UserId = dto.UserId.Value;
        if (!string.IsNullOrWhiteSpace(dto.StatusName)) entity.StatusName = dto.StatusName;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct) => _repo.DeleteAsync(id);

    private static RegularCalendarDto MapToDto(RegularCalendar e) => new(e.Id, e.RouteId, e.DepartureAt, e.ArrivedAt, e.UserId, e.StatusName);
}
