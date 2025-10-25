namespace WaterTransportService.Api.Services;

public interface IImageService<TDto, TCreateDto, TUpdateDto>
{
    Task<(IReadOnlyList<TDto> Items, int Total)> GetAllAsync(int page, int pageSize, CancellationToken ct);
    Task<TDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<TDto?> CreateAsync(TCreateDto dto, CancellationToken ct);
    Task<TDto?> UpdateAsync(Guid id, TUpdateDto dto, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
