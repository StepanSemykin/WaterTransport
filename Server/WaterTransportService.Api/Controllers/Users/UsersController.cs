using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Users;

namespace WaterTransportService.Api.Controllers.Users;

/// <summary>
/// Контроллер для управления пользователями и аутентификацией.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

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
        var (items, total) = await _service.GetAllAsync(page, pageSize);
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
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetById(Guid id)
    {
        var user = await _service.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    /// <summary>
    /// Создать нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания пользователя.</param>
    /// <returns>Созданный пользователь.</returns>
    /// <response code="201">Пользователь успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [Authorize(Roles = "admin")]
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить существующего пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор пользователя.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный пользователь.</returns>
    /// <response code="200">Пользователь успешно обновлен.</response>
    /// <response code="404">Пользователь не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор пользователя.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Пользователь успешно удален.</response>
    /// <response code="404">Пользователь не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>
    /// Регистрация нового пользователя.
    /// </summary>
    /// <param name="dto">Данные для регистрации.</param>
    /// <returns>Токены доступа и обновления.</returns>
    /// <response code="200">Регистрация успешна.</response>
    /// <response code="400">Пользователь уже существует или неверные данные.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginResponseDto>> Register([FromBody] RegisterDto dto)
    {
        var response = await _service.RegisterAsync(dto);
        if (response is null)
        {
            return BadRequest(new { message = "User with this phone already exists" });
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
    /// Вход пользователя.
    /// </summary>
    /// <param name="dto">Данные для входа.</param>
    /// <returns>Токены доступа и обновления.</returns>
    /// <response code="200">Аутентификация успешна.</response>
    /// <response code="401">Неверный телефон или пароль.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto dto)
    {
        var response = await _service.LoginAsync(dto);
        if (response is null)
        {
            return Unauthorized(new { message = "Invalid phone or password" });
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
    /// Обновление пары токенов по refresh токену.
    /// </summary>
    /// <param name="userId">Опционально: идентификатор пользователя, если access токен истек.</param>
    /// <returns>Новая пара токенов.</returns>
    /// <response code="200">Токены успешно обновлены.</response>
    /// <response code="401">Refresh токен отсутствует, неверен или истек.</response>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(RefreshTokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<RefreshTokenResponseDto>> RefreshToken([FromQuery] Guid? userId = null)
    {
        if (!Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
        {
            return Unauthorized(new { message = "Refresh token not found" });
        }


        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");

        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid finalUserId))
        {
            // userId получен из claims текущего токена
        }
        else if (userId.HasValue)
        {
            // userId передан в query параметре (когда access токен истек)
            finalUserId = userId.Value;
        }
        else
        {
            return Unauthorized(new { message = "User ID not found. Please provide userId query parameter." });
        }

        var response = await _service.RefreshTokenAsync(finalUserId, refreshToken);
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
    /// Выход пользователя и отзыв refresh токена.
    /// </summary>
    /// <returns>Результат операции.</returns>
    /// <response code="200">Выход выполнен успешно.</response>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                          ?? User.FindFirst("userId");

        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
        {
            await _service.LogoutAsync(userId);
        }

        HttpContext.Response.Cookies.Delete("AuthToken");
        HttpContext.Response.Cookies.Delete("RefreshToken");

        return Ok(new { message = "Logged out successfully" });
    }
}
