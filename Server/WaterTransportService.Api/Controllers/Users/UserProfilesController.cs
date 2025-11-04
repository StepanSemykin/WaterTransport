using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Users;

namespace WaterTransportService.Api.Controllers.Users;

/// <summary>
/// Контроллер для управления профилями пользователей.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UserProfilesController(IUserProfileService service) : ControllerBase
{
    private readonly IUserProfileService _service = service;

    /// <summary>
    /// Получить список всех профилей пользователей с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список профилей пользователей с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список профилей.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить профиль пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор профиля.</param>
    /// <returns>Данные профиля пользователя.</returns>
    /// <response code="200">Профиль успешно найден.</response>
    /// <response code="404">Профиль не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый профиль пользователя.
    /// </summary>
    /// <param name="dto">Данные для создания профиля.</param>
    /// <returns>Созданный профиль пользователя.</returns>
    /// <response code="201">Профиль успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserProfileDto>> Create([FromBody] CreateUserProfileDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null
            ? BadRequest()
            : CreatedAtAction(nameof(GetById), new { id = created.UserId }, created);
    }

    /// <summary>
    /// Обновить профиль пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор профиля.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный профиль пользователя.</returns>
    /// <response code="200">Профиль успешно обновлен.</response>
    /// <response code="404">Профиль не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileDto>> Update(Guid id, [FromBody] UpdateUserProfileDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить профиль пользователя.
    /// </summary>
    /// <param name="id">Уникальный идентификатор профиля.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Профиль успешно удален.</response>
    /// <response code="404">Профиль не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
