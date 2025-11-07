using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Users;

namespace WaterTransportService.Api.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    // GET api/users?page=1&pageSize=20
    [HttpGet]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    // GET api/users/{id}
    [Authorize(Roles = "common")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id)
    {
        var user = await _service.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    // POST api/users
    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT api/users/{id}
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE api/users/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    // POST api/users/register
    [HttpPost("register")]
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

    // POST api/users/login
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto dto)
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
        else {
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

                return Ok(result.Data);
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
    [HttpPost("refresh")]
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
        
        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out finalUserId))
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

    // GET api/users/profile
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetMyProfile()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId");
        if (!Guid.TryParse(id, out var userId)) return Unauthorized();

        var user = await _service.GetByIdAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }

    // POST api/users/logout
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // Получаем userId из claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) 
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
