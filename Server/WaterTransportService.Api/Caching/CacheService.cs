using Microsoft.Extensions.Caching.Memory;

namespace WaterTransportService.Api.Caching;

/// <summary>
/// Сервис для работы с кешем с поддержкой инвалидации по префиксам.
/// </summary>
public interface ICacheService
{
    /// <summary>
    /// Получить данные из кеша.
    /// </summary>
    Task<T?> GetAsync<T>(string key) where T : class;

    /// <summary>
    /// Сохранить данные в кеш.
    /// </summary>
    Task SetAsync<T>(string key, T value, TimeSpan expiration) where T : class;

    /// <summary>
    /// Удалить запись из кеша.
    /// </summary>
    Task RemoveAsync(string key);

    /// <summary>
    /// Удалить все записи с указанным префиксом.
    /// </summary>
    Task RemoveByPrefixAsync(string prefix);

    /// <summary>
    /// Очистить весь кеш.
    /// </summary>
    Task ClearAsync();
}

/// <summary>
/// Реализация сервиса кеширования с LZ4 сжатием.
/// </summary>
public class CacheService : ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<CacheService> _logger;
    private readonly HashSet<string> _keys = new();
    private readonly SemaphoreSlim _keysLock = new(1, 1);

    public CacheService(IMemoryCache cache, ILogger<CacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        if (_cache.TryGetValue<CompressedCacheEntry<T>>(key, out var entry) && entry != null)
        {
            await Task.CompletedTask;
            return entry.Decompress();
        }

        return null;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan expiration) where T : class
    {
        var compressed = CompressedCacheEntry<T>.Create(value);
        var size = compressed.GetSize();

        var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetSize(size)
            .SetSlidingExpiration(expiration)
            .SetAbsoluteExpiration(expiration * 2) // Абсолютный таймаут в 2 раза больше
            .SetPriority(GetPriority(key))
            .RegisterPostEvictionCallback(OnEviction);

        _cache.Set(key, compressed, cacheEntryOptions);

        // Добавляем ключ в список
        await _keysLock.WaitAsync();
        try
        {
            _keys.Add(key);
        }
        finally
        {
            _keysLock.Release();
        }
    }

    public async Task RemoveAsync(string key)
    {
        _cache.Remove(key);

        await _keysLock.WaitAsync();
        try
        {
            _keys.Remove(key);
        }
        finally
        {
            _keysLock.Release();
        }

        _logger.LogInformation("Cache invalidated: {Key}", key);
    }

    public async Task RemoveByPrefixAsync(string prefix)
    {
        await _keysLock.WaitAsync();
        try
        {
            var keysToRemove = _keys.Where(k => k.StartsWith(prefix)).ToList();

            foreach (var key in keysToRemove)
            {
                _cache.Remove(key);
                _keys.Remove(key);
            }

            if (keysToRemove.Count > 0)
            {
                _logger.LogInformation("Cache invalidated by prefix '{Prefix}': {Count} keys removed",
                    prefix, keysToRemove.Count);
            }
        }
        finally
        {
            _keysLock.Release();
        }
    }

    public async Task ClearAsync()
    {
        await _keysLock.WaitAsync();
        try
        {
            var count = _keys.Count;

            foreach (var key in _keys.ToList())
            {
                _cache.Remove(key);
            }

            _keys.Clear();

            _logger.LogInformation("Cache cleared: {Count} keys removed", count);
        }
        finally
        {
            _keysLock.Release();
        }
    }

    private CacheItemPriority GetPriority(string key)
    {
        // Завершенные заявки - высокий приоритет (редко меняются)
        if (key.Contains(":status:Completed") || key.Contains(":status:Cancelled"))
            return CacheItemPriority.High;

        // Активные данные - нормальный приоритет
        if (key.Contains(":active") || key.Contains(":status:Agreed"))
            return CacheItemPriority.Normal;

        // Доступные заявки - низкий приоритет (часто меняются)
        if (key.Contains(":available:"))
            return CacheItemPriority.Low;

        return CacheItemPriority.Normal;
    }

    private void OnEviction(object key, object? value, EvictionReason reason, object? state)
    {
        // Удаляем ключ из списка при вытеснении
        _keysLock.Wait();
        try
        {
            _keys.Remove(key.ToString()!);
        }
        finally
        {
            _keysLock.Release();
        }
    }
}
