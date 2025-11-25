using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    /// <returns>Список отзывов и информацию о пагинации.</returns>
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
    /// Получить все отзывы о конкретном пользователе-партнере.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя-партнера.</param>
    /// <returns>Список отзывов о партнере.</returns>
    /// <response code="200">Успешно получен список отзывов.</response>
    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ReviewDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByUser(Guid userId)
    {
        var reviews = await _service.GetReviewsByUserIdAsync(userId);
        return Ok(reviews);
    }

    /// <summary>
    /// Получить все отзывы о конкретном судне.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Список отзывов о судне.</returns>
    /// <response code="200">Успешно получен список отзывов.</response>
    [HttpGet("ship/{shipId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ReviewDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByShip(Guid shipId)
    {
        var reviews = await _service.GetReviewsByShipIdAsync(shipId);
        return Ok(reviews);
    }

    /// <summary>
    /// Получить все отзывы о конкретном порте.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Список отзывов о порте.</returns>
    /// <response code="200">Успешно получен список отзывов.</response>
    [HttpGet("port/{portId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ReviewDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByPort(Guid portId)
    {
        var reviews = await _service.GetReviewsByPortIdAsync(portId);
        return Ok(reviews);
    }

    /// <summary>
    /// Получить средний рейтинг пользователя-партнера.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя-партнера.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    /// <response code="200">Успешно получен средний рейтинг.</response>
    [HttpGet("user/{userId:guid}/average-rating")]
    [ProducesResponseType(typeof(AverageRatingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AverageRatingDto>> GetAverageRatingForUser(Guid userId)
    {
        var rating = await _service.GetAverageRatingForUserAsync(userId);
        return Ok(rating);
    }

    /// <summary>
    /// Получить средний рейтинг судна.
    /// </summary>
    /// <param name="shipId">Идентификатор судна.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    /// <response code="200">Успешно получен средний рейтинг.</response>
    [HttpGet("ship/{shipId:guid}/average-rating")]
    [ProducesResponseType(typeof(AverageRatingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AverageRatingDto>> GetAverageRatingForShip(Guid shipId)
    {
        var rating = await _service.GetAverageRatingForShipAsync(shipId);
        return Ok(rating);
    }

    /// <summary>
    /// Получить средний рейтинг порта.
    /// </summary>
    /// <param name="portId">Идентификатор порта.</param>
    /// <returns>Средний рейтинг и количество отзывов.</returns>
    /// <response code="200">Успешно получен средний рейтинг.</response>
    [HttpGet("port/{portId:guid}/average-rating")]
    [ProducesResponseType(typeof(AverageRatingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AverageRatingDto>> GetAverageRatingForPort(Guid portId)
    {
        var rating = await _service.GetAverageRatingForPortAsync(portId);
        return Ok(rating);
    }

    /// <summary>
    /// Создать новый отзыв.
    /// </summary>
    /// <param name="dto">Данные для создания отзыва.</param>
    /// <returns>Созданный отзыв.</returns>
    /// <response code="201">Отзыв успешно создан.</response>
    /// <response code="400">Неправильные данные.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ReviewDto>> Create([FromBody] CreateReviewDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var created = await _service.CreateAsync(dto, userId);
        return created is null 
            ? BadRequest("Unable to create review. Check order status, permissions, and target entity.")
            : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Обновить отзыв.
    /// </summary>
    /// <param name="id">Уникальный идентификатор отзыва.</param>
    /// <param name="dto">Данные для обновления.</param>
    /// <returns>Обновленный отзыв.</returns>
    /// <response code="200">Отзыв успешно обновлен.</response>
    /// <response code="404">Отзыв не найден.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="403">Нет прав на редактирование этого отзыва.</response>
    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ReviewDto>> Update(Guid id, [FromBody] UpdateReviewDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new { message = "User ID not found or invalid token" });
        }

        var updated = await _service.UpdateAsync(id, dto, userId);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Удалить отзыв.
    /// </summary>
    /// <param name="id">Уникальный идентификатор отзыва.</param>
    /// <returns>Результат операции.</returns>
    /// <response code="204">Отзыв успешно удален.</response>
    /// <response code="404">Отзыв не найден.</response>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
