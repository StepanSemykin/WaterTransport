using WaterTransportService.Api.DTO;
using WaterTransportService.Infrastructure.FileStorage;

namespace WaterTransportService.Api.Extensions;

/// <summary>
/// Методы расширения для ShipDetailsDto для работы с изображениями.
/// </summary>
public static class ShipDetailsDtoExtensions
{
    /// <summary>
    /// Обогащает ShipDetailsDto, загружая изображение в формате Base64 вместе с MIME типом.
    /// </summary>
    public static async Task<ShipDetailsDto> WithBase64ImageAsync(
        this ShipDetailsDto dto,
        IFileStorageService fileStorageService)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.PrimaryImageUrl))
            return dto;

        var (base64, mimeType) = await fileStorageService.GetImageAsBase64WithMimeTypeAsync(dto.PrimaryImageUrl);

        return new ShipDetailsDto(
            dto.Id,
            dto.Name,
            dto.ShipTypeId,
            dto.ShipTypeName,
            dto.Capacity,
            dto.RegistrationNumber,
            dto.YearOfManufacture,
            dto.MaxSpeed,
            dto.Width,
            dto.Length,
            dto.Description,
            dto.CostPerHour,
            dto.PortId,
            dto.UserId,
            base64, // Заменяем путь на Base64
            mimeType // Добавляем MIME тип
        );
    }

    /// <summary>
    /// Обогащает список ShipDetailsDto, загружая изображения в формате Base64.
    /// </summary>
    public static async Task<List<ShipDetailsDto>> WithBase64ImagesAsync(
        this IEnumerable<ShipDetailsDto> dtos,
        IFileStorageService fileStorageService)
    {
        if (dtos == null)
            return new List<ShipDetailsDto>();

        var tasks = dtos.Select(dto => dto.WithBase64ImageAsync(fileStorageService));
        return (await Task.WhenAll(tasks)).ToList();
    }
}
