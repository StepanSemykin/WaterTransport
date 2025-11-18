using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Calendars;

/// <summary>
/// Сервис для работы с календарями регулярных рейсов.
/// </summary>
public class RegularCalendarService(IEntityRepository<RegularCalendar, Guid> repo) : IRegularCalendarService
{
    private readonly IEntityRepository<RegularCalendar, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех календарей с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RegularCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.DepartureAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить календарь по идентификатору.
    /// </summary>
    public async Task<RegularCalendarDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый календарь регулярных рейсов.
    /// </summary>
    public async Task<RegularCalendarDto?> CreateAsync(CreateRegularCalendarDto dto)
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

    /// <summary>
    /// Обновить существующий календарь регулярных рейсов.
    /// </summary>
    public async Task<RegularCalendarDto?> UpdateAsync(Guid id, UpdateRegularCalendarDto dto)
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

    /// <summary>
    /// Удалить календарь регулярных рейсов.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность календаря в DTO.
    /// </summary>
    private static RegularCalendarDto MapToDto(RegularCalendar e) => new(e.Id, e.RouteId, e.DepartureAt, e.ArrivedAt, e.UserId, e.StatusName);
}
