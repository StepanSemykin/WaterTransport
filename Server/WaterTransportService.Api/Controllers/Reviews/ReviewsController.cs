using Microsoft.AspNetCore.Mvc;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Reviews;

namespace WaterTransportService.Api.Controllers.Reviews;

/// <summary>
/// Контроллер для управления отзывами.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ReviewsController(IReviewService service) : ControllerBase
{
    private readonly IReviewService _service = service;

    /// <summary>
    /// Получить список всех отзывов с пагинацией.
    /// </summary>
    /// <param name="page">Номер страницы (по умолчанию 1).</param>
    /// <param name="pageSize">Количество элементов на странице (по умолчанию 20, максимум 100).</param>
    /// <returns>Список отзывов с информацией о пагинации.</returns>
    /// <response code="200">Успешно получен список отзывов.</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _service.GetAllAsync(page, pageSize);
        return Ok(new { total, page, pageSize, items });
    }

    /// <summary>
    /// Получить отзыв по идентификатору.
    /// </summary>
    /// <param name="id">Уникальный идентификатор отзыва.</param>
    /// <returns>Данные отзыва.</returns>
    /// <response code="200">Отзыв успешно найден.</response>
    /// <response code="404">Отзыв не найден.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReviewDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        return e is null ? NotFound() : Ok(e);
    }

    /// <summary>
    /// Создать новый отзыв.
    /// </summary>
    /// <param name="dto">Данные для создания отзыва.</param>
    /// <returns>Созданный отзыв.</returns>
    /// <response code="201">Отзыв успешно создан.</response>
    /// <response code="400">Недопустимые данные.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ReviewDto>> Create([FromBody] CreateReviewDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created is null ? BadRequest() : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить отзыв.
    /// </summary>
    /// <param name="id">Уникальный идентификатор отзыва.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный отзыв.</returns>
    /// <response code="200">Отзыв успешно обновлен.</response>
    /// <response code="404">Отзыв не найден.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReviewDto>> Update(Guid id, [FromBody] UpdateReviewDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    /// <param name="id">Уникальный идентификатор отзыва.</param>
    /// <returns>Результат удаления.</returns>
    /// <response code="204">Отзыв успешно удален.</response>
    /// <response code="404">Отзыв не найден.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
