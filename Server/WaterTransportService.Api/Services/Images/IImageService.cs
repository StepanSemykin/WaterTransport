namespace WaterTransportService.Api.Services.Images;

public interface IImageService<TDto, TCreateDto, TUpdateDto>
{
    Task<(IReadOnlyList<TDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    Task<TDto?> GetByIdAsync(Guid id);
    Task<TDto?> CreateAsync(TCreateDto dto);
    Task<TDto?> UpdateAsync(Guid id, TUpdateDto dto);
    Task<bool> DeleteAsync(Guid id);
}
