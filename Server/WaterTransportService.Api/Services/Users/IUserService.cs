using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api.Services.Users;

/// <summary>
/// ������ ��� ���������� �������������� � ���������������.
/// </summary>
public interface IUserService
{
    /// <summary>
    /// �������� ������ ������������� � ����������.
    /// </summary>
    /// <param name="page">����� ��������.</param>
    /// <param name="pageSize">������ ��������.</param>
    /// <returns>������ �� ������� ������������� � ����� �����������.</returns>
    Task<(IReadOnlyList<UserDto> Items, int Total)> GetAllAsync(int page, int pageSize);

    /// <summary>
    /// �������� ������������ �� ��������������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <returns>DTO ������������ ��� null, ���� �� ������.</returns>
    Task<UserDto?> GetByIdAsync(Guid id);

    /// <summary>
    /// ������� ������ ������������.
    /// </summary>
    /// <param name="dto">������ ��� �������� ������������.</param>
    /// <returns>��������� ������������.</returns>
    Task<UserDto> CreateAsync(CreateUserDto dto);

    /// <summary>
    /// �������� ������������� ������������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <param name="dto">������ ��� ����������.</param>
    /// <returns>����������� ������������ ��� null ��� ������.</returns>
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto);

    /// <summary>
    /// ������� ������������.
    /// </summary>
    /// <param name="id">������������� ������������.</param>
    /// <returns>True, ���� �������� ������ �������.</returns>
    Task<bool> DeleteAsync(Guid id);

    // ���� ��������������

    /// <summary>
    /// ����������� ������ ������������.
    /// </summary>
    /// <param name="dto">������ ��� �����������.</param>
    /// <returns>����� � �������� ��� null, ���� ������������ ��� ����������.</returns>
    Task<LoginResponseDto?> RegisterAsync(RegisterDto dto);

    /// <summary>
    /// �������������� ������������.
    /// </summary>
    /// <param name="dto">������ ��� �����.</param>
    /// <returns>����� � �������� ��� null ��� ������ ��������������.</returns>
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);

    /// <summary>
    /// �������� ������ �� refresh ������.
    /// </summary>
    /// <param name="userId">������������� ������������.</param>
    /// <param name="refreshToken">Refresh �����.</param>
    /// <returns>����� ���� ������� ��� null ��� ������.</returns>
    Task<RefreshTokenResponseDto?> RefreshTokenAsync(Guid userId, string refreshToken);

    /// <summary>
    /// �������� refresh ����� ������������ (logout).
    /// </summary>
    /// <param name="userId">������������� ������������.</param>
    /// <returns>True, ���� �������� �������.</returns>
    Task<bool> LogoutAsync(Guid userId);
}
