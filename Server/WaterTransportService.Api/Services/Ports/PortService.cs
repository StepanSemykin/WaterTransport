using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Api.Services.Ports;

/// <summary>
/// Сервис для работы с портами.
/// </summary>
public class PortService(IPortRepository<Guid> repo, IMapper mapper) : IPortService
{
    private readonly IPortRepository<Guid> _repo = repo;

    /// <summary>
    /// Получить список всех портов с пагинацией.
    /// </summary>
    public async Task<(IReadOnlyList<Port> Items, int Total)> GetAllAsync(int page, int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);
        var all = (await _repo.GetAllAsync()).OrderBy(x => x.Title).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(u => u).ToList();
        return (items, total);
    }

    /// <summary>
    /// Получить порт по идентификатору.
    /// </summary>
    public async Task<PortDto?> GetByIdAsync(Guid id)
    {
        var port = await _repo.GetByIdAsync(id);
        var portDto = mapper.Map<PortDto?>(port);

        return port is null ? null : portDto;
    }

    /// <summary>
    /// Создать новый порт.
    /// </summary>
    public async Task<PortDto?> CreateAsync(CreatePortDto dto)
    {
        var entity = new Port
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            PortTypeId = dto.PortTypeId,
            PortType = null!,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Address = dto.Address
        };
        var created = await _repo.CreateAsync(entity);
        var createdDto = mapper.Map<PortDto?>(created);

        return createdDto;
    }

    /// <summary>
    /// Обновить существующий порт.
    /// </summary>
    public async Task<PortDto?> UpdateAsync(Guid id, UpdatePortDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return null;
        if (!string.IsNullOrWhiteSpace(dto.Title)) entity.Title = dto.Title;
        if (dto.PortTypeId.HasValue) entity.PortTypeId = dto.PortTypeId.Value;
        if (dto.Latitude.HasValue) entity.Latitude = dto.Latitude.Value;
        if (dto.Longitude.HasValue) entity.Longitude = dto.Longitude.Value;
        if (!string.IsNullOrWhiteSpace(dto.Address)) entity.Address = dto.Address;
        var updated = await _repo.UpdateAsync(entity, id);
        var updatedDto = mapper.Map<PortDto?>(updated);

        return updated ? updatedDto : null;
    }

    /// <summary>
    /// Удалить порт.
    /// </summary>
    public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);
}
