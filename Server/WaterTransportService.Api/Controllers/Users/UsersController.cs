using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Users;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WaterTransportService.Api.Controllers.Users;

/// <summary>
/// ���������� ��� ���������� �������������� � ���������������.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    /// <summary>
    /// �������� ������ ���� ������������� � ����������.
    /// </summary>
    /// <param name="page">����� �������� (�� ��������� 1).</param>
    /// <param name="pageSize">���������� ��������� �� �������� (�� ��������� 20, �������� 100).</param>
    /// <returns>������ ������������� � ����������� � ���������.</returns>
    /// <response code="200">������� ������� ������ �������������.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// �������� ������������ �� ��������������.
    /// </summary>
    /// <param name="id">���������� ������������� ������������.</param>
    /// <returns>������ ������������.</returns>
    /// <response code="200">������������ ������� ������.</response>
    /// <response code="404">������������ �� ������.</response>
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
    /// ������� ������ ������������.
    /// </summary>
    /// <param name="dto">������ ��� �������� ������������.</param>
    /// <returns>��������� ������������.</returns>
    /// <response code="201">������������ ������� ������.</response>
    /// <response code="400">������������ ������.</response>
    [Authorize(Roles = "admin")]
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
    {
        var created = await _service.CreateAsync(dto);
        //return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        return Ok(created);
    }

    /// <summary>
    /// �������� ������������� ������������.
    /// </summary>
    /// <param name="id">���������� ������������� ������������.</param>
    /// <param name="dto">������ ��� ����������.</param>
    /// <returns>����������� ������������.</returns>
    /// <response code="200">������������ ������� ��������.</response>
    /// <response code="404">������������ �� ������.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// ������� ������������.
    /// </summary>
    /// <param name="id">���������� ������������� ������������.</param>
    /// <returns>��������� ��������.</returns>
    /// <response code="204">������������ ������� ������.</response>
    /// <response code="404">������������ �� ������.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>
    /// ����������� ������ ������������.
    /// </summary>
    /// <param name="dto">������ ��� �����������.</param>
    /// <returns>������ ������� � ����������.</returns>
    /// <response code="200">����������� �������.</response>
    /// <response code="400">������������ ��� ���������� ��� �������� ������.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginResponseDto>> Register([FromBody] RegisterDto dto)
    {
        var response = await _service.RegisterAsync(dto);
        if (response is null)
        {
            return BadRequest(new 
            { 
                code = "USER_EXISTS",
                message = "Аккаунт с таким номером телефона уже есть" 
            });
        }

        HttpContext.Response.Cookies.Append("AuthToken", response.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });

        HttpContext.Response.Cookies.Append("RefreshToken", response.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(response);
    }

    /// <summary>
    /// ���� ������������.
    /// </summary>
    /// <param name="dto">������ ��� �����.</param>
    /// <returns>������ ������� � ����������.</returns>
    /// <response code="200">�������������� �������.</response>
    /// <response code="401">�������� ������� ��� ������.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status423Locked)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto dto)
    {
        var result = await _service.LoginAsync(dto);

        if (result is null)
        {
            return StatusCode(500, new 
            {
                code = "SERVER_ERROR",
                message = "Внутренняя ошибка сервера" 
            });
        }
        else 
        {
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
                        Response.Headers["Retry-After"] =
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
    }

    // POST api/users/refresh?userId={userId} (опционально, если access токен истек)
    /// <summary>
    /// ���������� ���� ������� �� refresh ������.
    /// </summary>
    /// <param name="userId">�����������: ������������� ������������, ���� access ����� �����.</param>
    /// <returns>����� ���� �������.</returns>
    /// <response code="200">������ ������� ���������.</response>
    /// <response code="401">Refresh ����� �����������, ������� ��� �����.</response>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(RefreshTokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<RefreshTokenResponseDto>> RefreshToken([FromQuery] Guid? userId = null)
    {
        // Извлекаем refresh токен из cookie
        if (!Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
        {
            return Unauthorized(new { message = "Refresh token not found" });
        }

        // Пытаемся получить userId из текущих claims или из query параметра
        Guid finalUserId;
        
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) 
                          ?? User.FindFirst("userId");

        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out finalUserId));

        //var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");

        //if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid finalUserId))
        //{
        //    // userId получен из claims текущего токена
        //}
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

        // Устанавливаем access токен в cookie
        HttpContext.Response.Cookies.Append("AuthToken", response.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });

        // Обновляем refresh токен в cookie
        HttpContext.Response.Cookies.Append("RefreshToken", response.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(response);
    }

    // GET api/users/me
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetMyProfile()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
        if (!Guid.TryParse(id, out var userId))
        {
            return Unauthorized();
        }

        var user = await _service.GetByIdAsync(userId);

        return user is null ? NotFound() : Ok(user);
    }

    /// <summary>
    /// ����� ������������ � ����� refresh ������.
    /// </summary>
    /// <returns>��������� ��������.</returns>
    /// <response code="200">����� �������� �������.</response>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        // Получаем userId из claims
        //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) 
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                          ?? User.FindFirst("userId");

        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
        {
            await _service.LogoutAsync(userId);
        }

        // Удаляем токены из cookie
        HttpContext.Response.Cookies.Delete("AuthToken");
        HttpContext.Response.Cookies.Delete("RefreshToken");

        return Ok(new { message = "Logged out successfully" });
    }

    //// GET api/users/profile/upcoming
    //[Authorize]
    //[HttpGet("profile/upcoming")]
    //public async Task<ActionResult<UserDto>> GetMyUpcomingTrips()
    //{
    //    var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
    //    if (!Guid.TryParse(id, out var userId)) return Unauthorized();

    //    var user = await _service.GetByIdAsync(userId);
    //    return user is null ? NotFound() : Ok(user);
    //}

    //// GET api/users/profile/completed
    //[Authorize]
    //[HttpGet("profile/completed")]
    //public async Task<ActionResult<UserDto>> GetMyCompletedTrips()
    //{
    //    var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
    //    if (!Guid.TryParse(id, out var userId)) return Unauthorized();

    //    var user = await _service.GetByIdAsync(userId);
    //    return user is null ? NotFound() : Ok(user);
    //}

    //// GET api/users/profile/stats
    //[Authorize]
    //[HttpGet("profile/stats")]
    //public async Task<ActionResult<UserDto>> GetMyStats()
    //{
    //    var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
    //    if (!Guid.TryParse(id, out var userId)) return Unauthorized();

    //    var user = await _service.GetByIdAsync(userId);
    //    return user is null ? NotFound() : Ok(user);
    //}
}
