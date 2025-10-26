using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Calendars;

namespace WaterTransportService.Api.Controllers.Rent;

[ApiController]
[Route("api/[controller]")]
public class RentCalendarsController(IRentCalendarService service) : ControllerBase
{
    private readonly IRentCalendarService _service = service;

    [HttpGet]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize, ct);
        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RentCalendarDto>> GetById(Guid id, CancellationToken ct)
    {
        var e = await _service.GetByIdAsync(id, ct);
        return e is null ? NotFound() : Ok(e);
    }

    [HttpPost]
    public async Task<ActionResult<RentCalendarDto>> Create([FromBody] CreateRentCalendarDto dto, CancellationToken ct)
    {
        var created = await _service.CreateAsync(dto, ct);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RentCalendarDto>> Update(Guid id, [FromBody] UpdateRentCalendarDto dto, CancellationToken ct)
    {
        var updated = await _service.UpdateAsync(id, dto, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}
