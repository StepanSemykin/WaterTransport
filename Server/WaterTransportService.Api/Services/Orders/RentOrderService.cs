using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Orders;

/// <summary>
/// Сервис для работы с заказами аренды.
/// </summary>
public class RentOrderService(IEntityRepository<RentOrder, Guid> repo) : IRentOrderService
{
    private readonly IEntityRepository<RentOrder, Guid> _repo = repo;

    /// <summary>
    /// Получить список всех заказов аренды с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<RentOrderDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderByDescending(x => x.CreatedAt).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить заказ аренды по идентификатору.
    /// </summary>
    public async Task<RentOrderDto?> GetByIdAsync(Guid id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый заказ аренды.
    /// </summary>
    public async Task<RentOrderDto?> CreateAsync(CreateRentOrderDto dto)
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

    /// <summary>
    /// Обновить существующий заказ аренды.
    /// </summary>
    public async Task<RentOrderDto?> UpdateAsync(Guid id, UpdateRentOrderDto dto)
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

    /// <summary>
    /// Удалить заказ аренды.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность заказа аренды в DTO.
    /// </summary>
    private static RentOrderDto MapToDto(RentOrder e) => new(e.Id, e.UserId, e.TotalPrice, e.NumberOfPassengers, e.RentCalendarId, e.RentalStartTime, e.RentalEndTime, e.OrderDate, e.StatusName, e.CreatedAt, e.CancelledAt);
}
