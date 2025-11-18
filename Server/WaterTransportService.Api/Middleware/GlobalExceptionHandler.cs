using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.Exceptions;

namespace WaterTransportService.Api.Middleware;

/// <summary>
/// Глобальный обработчик исключений приложения.
/// </summary>
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger = logger;

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Произошла необработанная ошибка: {Message}", exception.Message);

        var problemDetails = exception switch
        {
            DuplicatePasswordException dupPasswordEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Повторяющийся пароль",
                Detail = dupPasswordEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "DUPLICATE_PASSWORD"
                }
            },

            ArgumentException argEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Некорректные данные",
                Detail = argEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "INVALID_ARGUMENT"
                }
            },

            UnauthorizedAccessException => new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Неавторизованный доступ",
                Detail = "У вас нет прав для выполнения этой операции",
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "UNAUTHORIZED"
                }
            },

            _ => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Внутренняя ошибка сервера",
                Detail = exception.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "INTERNAL_SERVER_ERROR"
                }
            }
        };

        httpContext.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/json";

        await httpContext.Response.WriteAsJsonAsync(new
        {
            problemDetails.Status,
            problemDetails.Title,
            problemDetails.Detail,
            Code = problemDetails.Extensions?["code"]
        }, cancellationToken);

        return true;
    }
}
