using K4os.Compression.LZ4;
using System.Text;
using System.Text.Json;

namespace WaterTransportService.Api.Caching;

/// <summary>
/// Сжатая запись кеша с использованием LZ4.
/// </summary>
/// <typeparam name="T">Тип кешируемых данных.</typeparam>
public class CompressedCacheEntry<T>
{
    /// <summary>
    /// Сжатые данные.
    /// </summary>
    public required byte[] CompressedData { get; init; }

    /// <summary>
    /// Размер несжатых данных (для статистики).
    /// </summary>
    public int OriginalSize { get; init; }

    /// <summary>
    /// Размер сжатых данных.
    /// </summary>
    public int CompressedSize => CompressedData?.Length ?? 0;

    /// <summary>
    /// Коэффициент сжатия.
    /// </summary>
    public double CompressionRatio => OriginalSize > 0
        ? (double)CompressedSize / OriginalSize
        : 1.0;

    /// <summary>
    /// Создать сжатую запись из данных.
    /// </summary>
    public static CompressedCacheEntry<T> Create(T data)
    {
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
        {
            WriteIndented = false // Компактный JSON для лучшего сжатия
        });

        var bytes = Encoding.UTF8.GetBytes(json);
        var originalSize = bytes.Length;

        // Сжимаем с максимальным уровнем компрессии
        var compressed = LZ4Pickler.Pickle(bytes, LZ4Level.L12_MAX);

        return new CompressedCacheEntry<T>
        {
            CompressedData = compressed,
            OriginalSize = originalSize
        };
    }

    /// <summary>
    /// Распаковать данные из записи.
    /// </summary>
    public T Decompress()
    {
        var decompressed = LZ4Pickler.Unpickle(CompressedData);
        var json = Encoding.UTF8.GetString(decompressed);
        return JsonSerializer.Deserialize<T>(json)!;
    }

    /// <summary>
    /// Получить размер записи для IMemoryCache.
    /// </summary>
    public long GetSize()
    {
        return CompressedSize +
               sizeof(int) * 2 + // OriginalSize + CompressedSize
               IntPtr.Size; // Указатель на массив
    }
}
