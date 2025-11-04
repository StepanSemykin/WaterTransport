using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Calendars;

/// <summary>
/// Сервис для работы с календарями аренды.
/// </summary>
public class RentCalendarService(IEntityRepository<RentCalendar, Guid> repo) : IRentCalendarService
{
    private readonly IEntityRepository<RentCalendar, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех календарей аренды с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RentCalendarDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.LowerTimeLimit).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить календарь аренды по идентификатору.
    /// </summary>
    public async Task<RentCalendarDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый календарь аренды.
    /// </summary>
    public async Task<RentCalendarDto?> CreateAsync(CreateRentCalendarDto dto)
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

    /// <summary>
    /// Обновить существующий календарь аренды.
    /// </summary>
    public async Task<RentCalendarDto?> UpdateAsync(Guid id, UpdateRentCalendarDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (dto.ShipId.HasValue) entity.ShipId = dto.ShipId.Value;
        if (dto.LowerTimeLimit.HasValue) entity.LowerTimeLimit = dto.LowerTimeLimit.Value;
        if (dto.HighTimeLimit.HasValue) entity.HighTimeLimit = dto.HighTimeLimit.Value;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить календарь аренды.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность календаря аренды в DTO.
    /// </summary>
    private static RentCalendarDto MapToDto(RentCalendar e) => new(e.Id, e.ShipId, e.LowerTimeLimit, e.HighTimeLimit);
}
