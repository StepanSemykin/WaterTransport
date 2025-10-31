using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize, ct);
        return Ok(new { total, page, pageSize, items });
    }

    // GET api/users/{id}
    [Authorize(Roles = "common")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id, CancellationToken ct)
    {
        var user = await _service.GetByIdAsync(id, ct);
        return user is null ? NotFound() : Ok(user);
    }

    // POST api/users
    [HttpPost]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto, CancellationToken ct)
    {
        var created = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT api/users/{id}
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserDto dto, CancellationToken ct)
    {
        var updated = await _service.UpdateAsync(id, dto, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE api/users/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }

    // POST api/users/login
    [HttpPost("login")]
    
    public async Task<ActionResult<string>> Login([FromBody] LoginDto dto, CancellationToken ct)
    {
        var token = await _service.LoginAsync(dto);
        HttpContext.Response.Cookies.Append("AuthToken", token);
        return token is null ? Unauthorized() : Ok(new { token });
    }
}
