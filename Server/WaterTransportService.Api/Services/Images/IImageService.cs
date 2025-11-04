namespace WaterTransportService.Api.Services.Images;

/// <summary>
/// Интерфейс для сервисов управления изображениями.
/// </summary>
/// <typeparam name="TDto">Тип DTO для чтения изображения.</typeparam>
/// <typeparam name="TCreateDto">Тип DTO для создания изображения.</typeparam>
/// <typeparam name="TUpdateDto">Тип DTO для обновления изображения.</typeparam>
public interface IImageService<TDto, TCreateDto, TUpdateDto>
{
    /// <summary>
    /// Получить список всех изображений с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы.</param>
    /// <param name="pageSize">Размер страницы.</param>
    /// <returns>Кортеж со списком изображений и общим количеством.</returns>
    Task<(IReadOnlyList<TDto> Items, int Total)> GetAllAsync(int page, int pageSize);
    
    /// <summary>
    /// Получить изображение по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>DTO изображения или null, если не найдено.</returns>
    Task<TDto?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Создать новое изображение.
    /// </summary>
    /// <param name="dto">Данные для создания изображения.</param>
    /// <returns>Созданное изображение или null при ошибке.</returns>
    Task<TDto?> CreateAsync(TCreateDto dto);
    
    /// <summary>
    /// Обновить существующее изображение.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленное изображение или null при ошибке.</returns>
    Task<TDto?> UpdateAsync(Guid id, TUpdateDto dto);
    
    /// <summary>
    /// Удалить изображение.
    /// </summary>
    /// <param name="id">Идентификатор изображения.</param>
    /// <returns>True, если удаление прошло успешно.</returns>
    Task<bool> DeleteAsync(Guid id);
}
