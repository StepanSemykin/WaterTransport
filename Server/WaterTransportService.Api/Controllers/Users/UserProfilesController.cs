using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Users;

namespace WaterTransportService.Api.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
public class UserProfilesController(IUserProfileService service) : ControllerBase
{
    private readonly IUserProfileService _service = service;

    // GET api/userprofiles?page=1&pageSize=20
    [HttpGet]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize, ct);
        return Ok(new { total, page, pageSize, items });
    }

    // GET api/userprofiles/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserProfileDto>> GetById(Guid id, CancellationToken ct)
    {
        var e = await _service.GetByIdAsync(id, ct);
        return e is null ? NotFound() : Ok(e);
    }

    // POST api/userprofiles
    [HttpPost]
    public async Task<ActionResult<UserProfileDto>> Create([FromBody] CreateUserProfileDto dto, CancellationToken ct)
    {
        var created = await _service.CreateAsync(dto, ct);
        return created is null
            ? BadRequest()
            : CreatedAtAction(nameof(GetById), new { id = created.UserId }, created);
    }

    // PUT api/userprofiles/{id}
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserProfileDto>> Update(Guid id, [FromBody] UpdateUserProfileDto dto, CancellationToken ct)
    {
        var updated = await _service.UpdateAsync(id, dto, ct);
        return updated is null ? NotFound() : Ok(updated);
        }

    // DELETE api/userprofiles/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}
