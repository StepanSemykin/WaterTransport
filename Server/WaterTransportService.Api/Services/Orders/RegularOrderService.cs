using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Сервис для работы с заказами регулярных рейсов.
/// </summary>
public class RegularOrderService(IEntityRepository<RegularOrder, Guid> repo) : IRegularOrderService
{
    private readonly IEntityRepository<RegularOrder, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех заказов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RegularOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.CreatedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить заказ по идентификатору.
    /// </summary>
    public async Task<RegularOrderDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый заказ регулярного рейса.
    /// </summary>
    public async Task<RegularOrderDto?> CreateAsync(CreateRegularOrderDto dto)
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
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить существующий заказ регулярного рейса.
    /// </summary>
    public async Task<RegularOrderDto?> UpdateAsync(Guid id, UpdateRegularOrderDto dto)
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

    /// <summary>
    /// Удалить заказ регулярного рейса.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность заказа в DTO.
    /// </summary>
    private static RegularOrderDto MapToDto(RegularOrder e) => new(e.Id, e.UserId, e.TotalPrice, e.NumberOfPassengers, e.RegularCalendarId, e.OrderDate, e.StatusName, e.CreatedAt, e.CancelledAt);
}
