using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.Exceptions;
using ApiInvalidDataException = WaterTransportService.Api.Exceptions.InvalidDataException;

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
            // Пароли
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

            // Пользователи и доступ
            UserNotFoundException userNotFoundEx => new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Пользователь не найден",
                Detail = userNotFoundEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "USER_NOT_FOUND",
                    ["userId"] = userNotFoundEx.UserId
                }
            },

            AccountLockedException accountLockedEx => new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Аккаунт заблокирован",
                Detail = accountLockedEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "ACCOUNT_LOCKED",
                    ["userId"] = accountLockedEx.UserId,
                    ["lockedUntil"] = accountLockedEx.LockedUntil
                }
            },

            // Заказы
            OrderAlreadyConfirmedException orderConfirmedEx => new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Заказ уже подтвержден",
                Detail = orderConfirmedEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "ORDER_ALREADY_CONFIRMED",
                    ["orderId"] = orderConfirmedEx.OrderId
                }
            },

            InvalidOrderStatusException invalidStatusEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Неверный статус заказа",
                Detail = invalidStatusEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "INVALID_ORDER_STATUS",
                    ["orderId"] = invalidStatusEx.OrderId,
                    ["currentStatus"] = invalidStatusEx.CurrentStatus,
                    ["requiredStatus"] = invalidStatusEx.RequiredStatus
                }
            },

            RentalTimePastException rentalTimePastEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Время аренды прошло",
                Detail = rentalTimePastEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "RENTAL_TIME_PAST",
                    ["orderId"] = rentalTimePastEx.OrderId,
                    ["rentalTime"] = rentalTimePastEx.RentalTime
                }
            },

            // Отклики
            DuplicateOfferException duplicateOfferEx => new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Дублирующийся отклик",
                Detail = duplicateOfferEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "DUPLICATE_OFFER",
                    ["partnerId"] = duplicateOfferEx.PartnerId,
                    ["orderId"] = duplicateOfferEx.OrderId
                }
            },

            // Суда
            ShipDoesNotMeetRequirementsException shipRequirementsEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Судно не соответствует требованиям",
                Detail = shipRequirementsEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "SHIP_REQUIREMENTS_NOT_MET",
                    ["shipId"] = shipRequirementsEx.ShipId,
                    ["orderId"] = shipRequirementsEx.OrderId,
                    ["reason"] = shipRequirementsEx.Reason
                }
            },

            // Общие
            EntityNotFoundException entityNotFoundEx => new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Сущность не найдена",
                Detail = entityNotFoundEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "ENTITY_NOT_FOUND",
                    ["entityType"] = entityNotFoundEx.EntityType,
                    ["entityId"] = entityNotFoundEx.EntityId
                }
            },

            ApiInvalidDataException invalidDataEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Невалидные данные",
                Detail = invalidDataEx.Message,
                Extensions = new Dictionary<string, object?>
                {
                    ["code"] = "INVALID_DATA",
                    ["fieldName"] = invalidDataEx.FieldName,
                    ["value"] = invalidDataEx.Value
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
            Code = problemDetails.Extensions?["code"],
            Details = problemDetails.Extensions
        }, cancellationToken);

        return true;
    }
}
