using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Exceptions;
using WaterTransportService.Api.Services.Users;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Authentication.Services;
using AuthUserDto = WaterTransportService.Authentication.DTO.UserDto;

namespace WaterTransportService.Api.Controllers.Users;

/// <summary>
/// Контроллер для управления пользователями и аутентификацией.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService, IAuthService authService) : ControllerBase
{
    /// <summary>
    /// Получить список всех пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список пользователей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список пользователей.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await userService.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор пользователя.</param>
    /// <returns>Данные пользователя.</returns>
    /// <response code="200">Пользователь успешно найден.</response>
    /// <response code="404">Пользователь не найден.</response>
    [Authorize(Roles = "common")]
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(AuthUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AuthUserDto>> GetById(Guid id)
    {
        var user = await userService.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    /// <summary>
    /// Создать нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь.</returns>
    /// <response code="201">Пользователь успешно создан.</response>
    /// <response code="400">Некорректные данные.</response>
    [Authorize(Roles = "admin")]
    [HttpPost]
    [ProducesResponseType(typeof(AuthUserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthUserDto>> Create([FromBody] CreateUserDto dto)
    {
        var created = await userService.CreateAsync(dto);
        return created is null ? BadRequest() : Ok(created);
    }

    /// <summary>
    /// Обновить существующего пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный пользователь.</returns>
    /// <response code="200">Пользователь успешно обновлен.</response>
    /// <response code="400">Некорректные данные (например, повторяющийся пароль).</response>
    /// <response code="404">Пользователь не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(AuthUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AuthUserDto>> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var updated = await userService.UpdateAsync(id, dto);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (DuplicatePasswordException ex)
        {
            return BadRequest(new
            {
                code = "DUPLICATE_PASSWORD",
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Удалить пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор пользователя.</param>
    /// <returns>Результат операции.</returns>
    /// <response code="204">Пользователь успешно удален.</response>
    /// <response code="404">Пользователь не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await userService.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>
    /// Зарегистрировать нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для регистрации.</param>
    /// <returns>Токены доступа и информация.</returns>
    /// <response code="200">Регистрация успешна.</response>
    /// <response code="400">Пользователь уже существует или неверные данные.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var response = await authService.RegisterAsync(dto);
        if (response is null)
        {
            return BadRequest(new
            {
                code = "SERVER_ERROR",
                message = "Внутренняя ошибка сервера"
            });
        }
        if (!response.Success)
        {
            return BadRequest(response);
        }

        HttpContext.Response.Cookies.Append("AuthToken", response.Data!.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });

        HttpContext.Response.Cookies.Append("RefreshToken", response.Data.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(response);
    }

    /// <summary>
    /// Вход пользователя.
    /// </summary>
    /// <param name="dto">Данные для входа.</param>
    /// <returns>Токены доступа и информация.</returns>
    /// <response code="200">Аутентификация успешна.</response>
    /// <response code="401">Неверные данные для авторизации.</response>
    /// <response code="403">Доступ запрещен.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="423">Пользователь временно заблокирован.</response>
    /// <response code="500">Ошибка сервера.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status423Locked)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AuthUserDto>> Login([FromBody] LoginDto dto)
    {
        var result = await authService.LoginAsync(dto);

        if (result is null)
        {
            return StatusCode(500, new
            {
                code = "SERVER_ERROR",
                message = "Внутренняя ошибка сервера"
            });
        }

        if (result.Success)
        {
            Response.Cookies.Append("AuthToken", result.Data!.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });
            Response.Cookies.Append("RefreshToken", result.Data!.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(result.Data.User);
        }

        switch (result.Failure)
        {
            case LoginFailureReason.Locked:
                if (result.LockedUntil is DateTimeOffset until)
                    Response.Headers.RetryAfter =
                        Math.Max(0, (int)Math.Ceiling((until - DateTimeOffset.UtcNow).TotalSeconds)).ToString();

                return StatusCode(423, new
                {
                    code = "ACCOUNT_LOCKED",
                    message = "Аккаунт временно заблокирован",
                    lockedUntil = result.LockedUntil
                });

            case LoginFailureReason.InvalidPassword:
                return Unauthorized(new
                {
                    code = "INVALID_CREDENTIALS",
                    message = "Неверный телефон или пароль",
                    remainingAttempts = result.RemainingAttempts
                });

            case LoginFailureReason.NotFound:
                return StatusCode(404, new
                {
                    code = "NOT_FOUND",
                    message = "Аккаунт не найден"
                });

            case LoginFailureReason.Inactive:
                return StatusCode(403, new
                {
                    code = "ACCOUNT INACTIVE",
                    message = "Аккаунт неактивен"
                });

            default:
                return StatusCode(500, new
                {
                    code = "UNKNOWN_ERROR",
                    message = "Неизвестная ошибка аутентификации"
                });
        }
    }

    // POST api/users/refresh?userId={userId} (опционально, если access токен истек)
    /// <summary>
    /// Обновление пары токенов по refresh токену.
    /// </summary>
    /// <param name="userId">Опционально: идентификатор пользователя, если access токен истек.</param>
    /// <returns>Новая пара токенов.</returns>
    /// <response code="200">Токены успешно обновлены.</response>
    /// <response code="401">Refresh токен недействителен, истекший или ложный.</response>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(RefreshTokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<RefreshTokenResponseDto>> RefreshToken([FromQuery] Guid? userId = null)
    {
        if (!Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
        {
            return Unauthorized(new { message = "Refresh token not found" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");

        Guid finalUserId;
        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out finalUserId))
        {
            // finalUserId уже установлен
        }
        else if (userId.HasValue)
        {
            finalUserId = userId.Value;
        }
        else
        {
            return Unauthorized(new { message = "User ID not found. Please provide userId query parameter." });
        }

        var response = await authService.RefreshTokenAsync(finalUserId, refreshToken);
        if (response is null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        HttpContext.Response.Cookies.Append("AuthToken", response.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });

        HttpContext.Response.Cookies.Append("RefreshToken", response.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(response);
    }

    /// <summary>
    /// Получить профиль текущего пользователя.
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(AuthUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AuthUserDto>> GetMyProfile()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
        if (!Guid.TryParse(id, out var userId))
        {
            return Unauthorized();
        }

        var user = await userService.GetByIdAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }

    /// <summary>
    /// Выйти пользователя и удалить refresh токены.
    /// </summary>
    /// <returns>Результат операции.</returns>
    /// <response code="200">Выход выполнен успешно.</response>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");

        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
        {
            await authService.LogoutAsync(userId);
        }

        HttpContext.Response.Cookies.Delete("AuthToken");
        HttpContext.Response.Cookies.Delete("RefreshToken");

        return Ok(new { message = "Logged out successfully" });
    }

    [Authorize]
    [HttpPost("change-password/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDto dto)
    {
        var updateDto = new UpdateUserDto
        {
            NewPassword = dto.NewPassword,
            CurrentPassword = dto.CurrentPassword
        };

        try
        {
            var result = await userService.UpdateAsync(id, updateDto);
            if (result is null)
                return NotFound();

            return NoContent();
        }
        catch (DuplicatePasswordException ex)
        {
            return BadRequest(new { code = "DUPLICATE_PASSWORD", message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { code = "INVALID_PASSWORD", message = ex.Message });
        }
    }

    /// <summary>
    /// Сменить роль обычному пользователю на партнера.
    /// </summary>
    /// <returns> Обновленный пользователь с ролью партнера.</returns>
    /// <response code="200">Обновление роли выполнено успешно.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка сервера.</response>
    [Authorize(Roles = "common")]
    [HttpPost("become-partner")]
    [ProducesResponseType(typeof(AuthUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AuthUserDto>> BecomePartner()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
        if (!Guid.TryParse(id, out var userId))
        {
            return Unauthorized();
        }

        var user = await userService.GetByIdAsync(userId);
        if (user is null)
        {
            return NotFound();
        }

        if (string.Equals(user.Role, "partner", StringComparison.OrdinalIgnoreCase))
        {
            return Ok(user);
        }

        var dto = new UpdateUserDto
        {
            Role = "partner"
        };

        var updated = await userService.UpdateAsync(userId, dto);
        if (updated is null)
        {
            return NotFound();
        }

        var response = await userService.GenerateTokenAsync(userId, updated);
        if (response is null)
        {
            return StatusCode(500, new
            {
                code = "TOKEN_GENERATION_FAILED",
                message = "Не удалось сгенерировать новые токены"
            });
        }
        Response.Cookies.Append("AuthToken", response.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });

        Response.Cookies.Append("RefreshToken", response.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(updated);
    }
}