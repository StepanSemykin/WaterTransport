using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Ports;

/// <summary>
/// Сервис для работы с типами портов.
/// </summary>
public class PortTypeService(IEntityRepository<PortType, ushort> repo) : IPortTypeService
{
    private readonly IEntityRepository<PortType, ushort> _repo = repo;

    /// <summary>
    /// Получить список всех типов портов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<PortTypeDto> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Title).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToDto).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить тип порта по идентификатору.
    /// </summary>
    public async Task<PortTypeDto?> GetByIdAsync(ushort id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e is null ? null : MapToDto(e);
    }

    /// <summary>
    /// Создать новый тип порта.
    /// </summary>
    public async Task<PortTypeDto?> CreateAsync(CreatePortTypeDto dto)
    {
        var entity = new PortType
        {
            Id = dto.Id,
            Title = dto.Title
        };
        var created = await _repo.CreateAsync(entity);
        return MapToDto(created);
    }

    /// <summary>
    /// Обновить существующий тип порта.
    /// </summary>
    public async Task<PortTypeDto?> UpdateAsync(ushort id, UpdatePortTypeDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Title)) entity.Title = dto.Title;
        var ok = await _repo.UpdateAsync(entity, id);
        return ok ? MapToDto(entity) : null;
    }

    /// <summary>
    /// Удалить тип порта.
    /// </summary>
    public Task<bool> DeleteAsync(ushort id) => _repo.DeleteAsync(id);

    /// <summary>
    /// Преобразовать сущность типа порта в DTO.
    /// </summary>
    private static PortTypeDto MapToDto(PortType e) => new(e.Id, e.Title);
}
