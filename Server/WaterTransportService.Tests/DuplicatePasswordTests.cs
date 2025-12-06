using AutoMapper;
using Moq;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Exceptions;
using WaterTransportService.Api.Services.Users;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Authentication.Services;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;
using AuthUserDto = WaterTransportService.Authentication.DTO.UserDto;

namespace WaterTransportService.Tests;

/// <summary>
/// Тесты для проверки обработки повторяющихся паролей.
/// </summary>
public class DuplicatePasswordTests
{
    private readonly Mock<IUserRepository<Guid>> _mockUserRepo;
    private readonly Mock<IEntityRepository<OldPassword, Guid>> _mockOldPasswordRepo;
    private readonly Mock<IEntityRepository<UserProfile, Guid>> _mockUserProfileRepo;
    private readonly Mock<IPasswordHasher> _mockPasswordHasher;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<IMapper> _mockMapper;
    private readonly UserService _userService;

    public DuplicatePasswordTests()
    {
        _mockUserRepo = new Mock<IUserRepository<Guid>>();
        _mockOldPasswordRepo = new Mock<IEntityRepository<OldPassword, Guid>>();
        _mockUserProfileRepo = new Mock<IEntityRepository<UserProfile, Guid>>();
        _mockPasswordHasher = new Mock<IPasswordHasher>();
        _mockTokenService = new Mock<ITokenService>();
        _mockMapper = new Mock<IMapper>();

        _userService = new UserService(
            _mockMapper.Object,
            _mockUserRepo.Object,
            _mockOldPasswordRepo.Object,
            _mockUserProfileRepo.Object,
            _mockPasswordHasher.Object,
            _mockTokenService.Object
        );
    }

    [Fact]
    public async Task UpdateAsync_DuplicateCurrentPassword_ThrowsDuplicatePasswordException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var currentPasswordHash = "current_password_hash";
        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = currentPasswordHash,
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        var dto = new UpdateUserDto
        {
            NewPassword = "samePassword123"
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockOldPasswordRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(new List<OldPassword>());

        // Текущий пароль совпадает с новым
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, currentPasswordHash))
            .Returns(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<DuplicatePasswordException>(
            () => _userService.UpdateAsync(userId, dto)
        );

        Assert.Equal("Новый пароль не должен совпадать с текущим паролем.", exception.Message);
    }

    [Fact]
    public async Task UpdateAsync_DuplicateOldPassword_ThrowsDuplicatePasswordException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var currentPasswordHash = "current_password_hash";
        var oldPasswordHash = "old_password_hash";

        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = currentPasswordHash,
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        var oldPassword = new OldPassword
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            User = user,
            Hash = oldPasswordHash,
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };

        var dto = new UpdateUserDto
        {
            NewPassword = "oldPassword123"
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockOldPasswordRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(new List<OldPassword> { oldPassword });

        // Новый пароль не совпадает с текущим
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, currentPasswordHash))
            .Returns(false);

        // Но совпадает со старым паролем
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, oldPasswordHash))
            .Returns(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<DuplicatePasswordException>(
            () => _userService.UpdateAsync(userId, dto)
        );

        Assert.Equal("Новый пароль не должен совпадать с ранее использованными паролями.", exception.Message);
    }

    [Fact]
    public async Task UpdateAsync_UniquePassword_SuccessfullyUpdates()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var currentPasswordHash = "current_password_hash";
        var oldPasswordHash = "old_password_hash";
        var newPasswordHash = "new_password_hash";

        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = currentPasswordHash,
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        var oldPassword = new OldPassword
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            User = user,
            Hash = oldPasswordHash,
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };

        var dto = new UpdateUserDto
        {
            NewPassword = "newUniquePassword123"
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockOldPasswordRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(new List<OldPassword> { oldPassword });

        // Новый пароль не совпадает ни с текущим, ни со старым
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, currentPasswordHash))
            .Returns(false);
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, oldPasswordHash))
            .Returns(false);

        _mockPasswordHasher.Setup(x => x.Generate(dto.NewPassword))
            .Returns(newPasswordHash);

        _mockOldPasswordRepo.Setup(x => x.CreateAsync(It.IsAny<OldPassword>()))
            .ReturnsAsync((OldPassword op) => op);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        _mockMapper.Setup(x => x.Map<AuthUserDto>(It.IsAny<User>()))
            .Returns(new AuthUserDto(userId, user.Phone, user.Role));

        // Act
        var result = await _userService.UpdateAsync(userId, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal(user.Phone, result.Phone);

        // Verify old password was saved
        _mockOldPasswordRepo.Verify(x => x.CreateAsync(It.Is<OldPassword>(
            op => op.UserId == userId && op.Hash == currentPasswordHash)), Times.Once);

        // Verify new password hash was generated
        _mockPasswordHasher.Verify(x => x.Generate(dto.NewPassword), Times.Once);

        // Verify user was updated
        _mockUserRepo.Verify(x => x.UpdateAsync(
            It.Is<User>(u => u.Hash == newPasswordHash), userId), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_MultipleOldPasswords_ChecksAllOfThem()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var currentPasswordHash = "current_hash";
        var oldPassword1Hash = "old_hash_1";
        var oldPassword2Hash = "old_hash_2";
        var oldPassword3Hash = "old_hash_3";

        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = currentPasswordHash,
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        var oldPasswords = new List<OldPassword>
        {
            new() { Id = Guid.NewGuid(), UserId = userId, User = user, Hash = oldPassword1Hash, CreatedAt = DateTime.UtcNow.AddDays(-90) },
            new() { Id = Guid.NewGuid(), UserId = userId, User = user, Hash = oldPassword2Hash, CreatedAt = DateTime.UtcNow.AddDays(-60) },
            new() { Id = Guid.NewGuid(), UserId = userId, User = user, Hash = oldPassword3Hash, CreatedAt = DateTime.UtcNow.AddDays(-30) }
        };

        var dto = new UpdateUserDto
        {
            NewPassword = "matchesSecondOldPassword"
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockOldPasswordRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(oldPasswords);

        // Не совпадает с текущим
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, currentPasswordHash))
            .Returns(false);

        // Не совпадает с первым старым
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, oldPassword1Hash))
            .Returns(false);

        // СОВПАДАЕТ со вторым старым
        _mockPasswordHasher.Setup(x => x.Verify(dto.NewPassword, oldPassword2Hash))
            .Returns(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<DuplicatePasswordException>(
            () => _userService.UpdateAsync(userId, dto)
        );

        Assert.Equal("Новый пароль не должен совпадать с ранее использованными паролями.", exception.Message);

        // Verify that it stopped checking after finding a match
        _mockPasswordHasher.Verify(x => x.Verify(dto.NewPassword, oldPassword3Hash), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_NoPasswordChange_DoesNotThrowException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = "current_hash",
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        var dto = new UpdateUserDto
        {
            Phone = "+79991111111",
            NewPassword = null // Не меняем пароль
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        _mockMapper.Setup(x => x.Map<AuthUserDto>(It.IsAny<User>()))
            .Returns(new AuthUserDto(userId, dto.Phone!, user.Role));

        // Act
        var result = await _userService.UpdateAsync(userId, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal(dto.Phone, result.Phone);

        // Verify password checks were not performed
        _mockPasswordHasher.Verify(x => x.Verify(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockOldPasswordRepo.Verify(x => x.GetAllAsync(), Times.Never);
    }
}
