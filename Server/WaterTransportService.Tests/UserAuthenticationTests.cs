using AutoMapper;
using Moq;
using WaterTransportService.Api.DTO;
using WaterTransportService.Api.Services.Users;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Authentication.Services;
using WaterTransportService.Infrastructure.PasswordHasher;
using WaterTransportService.Infrastructure.PasswordValidator;
using WaterTransportService.Model.Entities;
using WaterTransportService.Model.Repositories.EntitiesRepository;

namespace WaterTransportService.Tests;

/// <summary>
/// Тест-кейсы для аутентификации: Register, Login, Logout, RefreshToken
/// </summary>
public class UserAuthenticationTests
{
    private readonly Mock<IUserRepository<Guid>> _mockUserRepo;
    private readonly Mock<IEntityRepository<UserProfile, Guid>> _mockUserProfileRepo;
    private readonly Mock<IPasswordHasher> _mockPasswordHasher;
    private readonly Mock<IPasswordValidator> _mockPasswordValidator;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<IMapper> _mockMapper;
    private readonly AuthService _authService;

    public UserAuthenticationTests()
    {
        _mockUserRepo = new Mock<IUserRepository<Guid>>();
        _mockUserProfileRepo = new Mock<IEntityRepository<UserProfile, Guid>>();
        _mockPasswordHasher = new Mock<IPasswordHasher>();
        _mockPasswordValidator = new Mock<IPasswordValidator>();
        _mockTokenService = new Mock<ITokenService>();
        _mockMapper = new Mock<IMapper>();

        _authService = new AuthService(
            _mockMapper.Object,
            _mockUserRepo.Object,
            _mockUserProfileRepo.Object,
            _mockPasswordHasher.Object,
            _mockPasswordValidator.Object,
            _mockTokenService.Object
        );
    }

    #region Register Tests

    [Fact]
    public async Task RegisterAsync_NewUser_ReturnsLoginResponseDto()
    {
        // Arrange
        var registerDto = new RegisterDto("+79991234567", "password123");
        var userId = Guid.NewGuid();
        var hashedPassword = "hashed_password";
        var accessToken = "access_token_123";
        var refreshToken = "refresh_token_456";

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(registerDto.Phone))
            .ReturnsAsync((User?)null);

        _mockPasswordValidator.Setup(x => x.IsPasswordValid(registerDto.Password))
            .Returns(true);

        _mockPasswordHasher.Setup(x => x.Generate(registerDto.Password))
            .Returns(hashedPassword);

        _mockUserRepo.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) => { u.Id = userId; return u; });

        _mockUserProfileRepo.Setup(x => x.CreateAsync(It.IsAny<UserProfile>()))
            .ReturnsAsync((UserProfile p) => p);

        _mockTokenService.Setup(x => x.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(accessToken);

        _mockTokenService.Setup(x => x.GenerateRefreshToken())
            .Returns(refreshToken);

        _mockTokenService.Setup(x => x.SaveRefreshTokenAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<DateTime>()))
            .Returns(Task.CompletedTask);

        var userDto = new UserDto(userId, registerDto.Phone, "common");
        _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>()))
            .Returns(userDto);

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal(accessToken, result.Data.AccessToken);
        Assert.Equal(refreshToken, result.Data.RefreshToken);
        Assert.Equal(userId, result.Data.User.Id);
        Assert.Equal(registerDto.Phone, result.Data.User.Phone);
        Assert.Equal("common", result.Data.User.Role);

        _mockUserRepo.Verify(x => x.CreateAsync(It.Is<User>(u =>
            u.Phone == registerDto.Phone &&
            u.IsActive == true &&
            u.Role == "common")), Times.Once);

        _mockUserProfileRepo.Verify(x => x.CreateAsync(It.IsAny<UserProfile>()), Times.Once);
        _mockTokenService.Verify(x => x.SaveRefreshTokenAsync(It.IsAny<Guid>(), refreshToken, It.IsAny<DateTime>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_ExistingUser_ReturnsNull()
    {
        // Arrange
        var registerDto = new RegisterDto("+79991234567", "password123");
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Phone = registerDto.Phone,
            Hash = "existing_hash",
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(registerDto.Phone))
            .ReturnsAsync(existingUser);

        _mockPasswordValidator.Setup(x => x.IsPasswordValid(registerDto.Password))
            .Returns(true);

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.NotNull(result.Error);
        _mockUserRepo.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Never);
        _mockTokenService.Verify(x => x.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_CreatesUserWithHashedPassword()
    {
        // Arrange
        var registerDto = new RegisterDto("+79991234567", "MySecurePassword123");
        var userId = Guid.NewGuid();
        var hashedPassword = "securely_hashed_password";

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        _mockPasswordValidator.Setup(x => x.IsPasswordValid(registerDto.Password))
            .Returns(true);

        _mockPasswordHasher.Setup(x => x.Generate(registerDto.Password))
            .Returns(hashedPassword);

        _mockUserRepo.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) => { u.Id = userId; return u; });

        _mockUserProfileRepo.Setup(x => x.CreateAsync(It.IsAny<UserProfile>()))
            .ReturnsAsync((UserProfile p) => p);

        _mockTokenService.Setup(x => x.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns("token");

        _mockTokenService.Setup(x => x.GenerateRefreshToken())
            .Returns("refresh");

        _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>()))
            .Returns(new UserDto(userId, registerDto.Phone, "common"));

        // Act
        await _authService.RegisterAsync(registerDto);

        // Assert
        _mockPasswordHasher.Verify(x => x.Generate(registerDto.Password), Times.Once);
        _mockUserRepo.Verify(x => x.CreateAsync(It.Is<User>(u => u.Hash == hashedPassword)), Times.Once);
    }

    #endregion

    #region Login Tests

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsSuccessWithTokens()
    {
        // Arrange
        var loginDto = new LoginDto { Phone = "+79991234567", Password = "password123" };
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Phone = loginDto.Phone,
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            FailedLoginAttempts = 0,
            LockedUntil = null,
            CreatedAt = DateTime.UtcNow
        };

        var accessToken = "access_token_123";
        var refreshToken = "refresh_token_456";
        var userDto = new UserDto(userId, user.Phone, user.Role);

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(loginDto.Phone))
            .ReturnsAsync(user);

        _mockPasswordHasher.Setup(x => x.Verify(loginDto.Password, user.Hash))
            .Returns(true);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        _mockTokenService.Setup(x => x.GenerateAccessToken(user.Phone, user.Role, userId))
            .Returns(accessToken);

        _mockTokenService.Setup(x => x.GenerateRefreshToken())
            .Returns(refreshToken);

        _mockTokenService.Setup(x => x.SaveRefreshTokenAsync(userId, refreshToken, It.IsAny<DateTime>()))
            .Returns(Task.CompletedTask);

        _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>()))
            .Returns(userDto);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal(accessToken, result.Data.AccessToken);
        Assert.Equal(refreshToken, result.Data.RefreshToken);
        Assert.Equal(userId, result.Data.User.Id);
        Assert.Equal(loginDto.Phone, result.Data.User.Phone);

        _mockUserRepo.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.FailedLoginAttempts == 0 &&
            u.LockedUntil == null &&
            u.IsActive == true), userId), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_UserNotFound_ReturnsFailureNotFound()
    {
        // Arrange
        var loginDto = new LoginDto { Phone = "+79991234567", Password = "password123" };

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(loginDto.Phone))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal(LoginFailureReason.NotFound, result.Failure);
        Assert.Null(result.Data);

        _mockPasswordHasher.Verify(x => x.Verify(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_IncreasesFailedAttempts()
    {
        // Arrange
        var loginDto = new LoginDto { Phone = "+79991234567", Password = "wrong_password" };
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Phone = loginDto.Phone,
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            FailedLoginAttempts = 0,
            LockedUntil = null,
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(loginDto.Phone))
            .ReturnsAsync(user);

        _mockPasswordHasher.Setup(x => x.Verify(loginDto.Password, user.Hash))
            .Returns(false);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal(LoginFailureReason.InvalidPassword, result.Failure);
        Assert.Equal(4, result.RemainingAttempts); // 5 - 1 = 4

        _mockUserRepo.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.FailedLoginAttempts == 1), userId), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_FifthInvalidAttempt_LocksAccount()
    {
        // Arrange
        var loginDto = new LoginDto { Phone = "+79991234567", Password = "wrong_password" };
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Phone = loginDto.Phone,
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            FailedLoginAttempts = 4,
            LockedUntil = null,
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(loginDto.Phone))
            .ReturnsAsync(user);

        _mockPasswordHasher.Setup(x => x.Verify(loginDto.Password, user.Hash))
            .Returns(false);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal(LoginFailureReason.Locked, result.Failure);
        Assert.NotNull(result.LockedUntil);

        _mockUserRepo.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.FailedLoginAttempts == 5 &&
            u.LockedUntil != null), userId), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_LockedAccount_ReturnsFailureLocked()
    {
        // Arrange
        var loginDto = new LoginDto { Phone = "+79991234567", Password = "password123" };
        var lockedUntil = DateTime.UtcNow.AddMinutes(10);
        var user = new User
        {
            Id = Guid.NewGuid(),
            Phone = loginDto.Phone,
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            FailedLoginAttempts = 5,
            LockedUntil = lockedUntil,
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(loginDto.Phone))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal(LoginFailureReason.Locked, result.Failure);
        Assert.NotNull(result.LockedUntil);

        _mockPasswordHasher.Verify(x => x.Verify(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_SuccessfulLogin_ResetsFailedAttempts()
    {
        // Arrange
        var loginDto = new LoginDto { Phone = "+79991234567", Password = "password123" };
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Phone = loginDto.Phone,
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            FailedLoginAttempts = 3,
            LockedUntil = null,
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByPhoneAsync(loginDto.Phone))
            .ReturnsAsync(user);

        _mockPasswordHasher.Setup(x => x.Verify(loginDto.Password, user.Hash))
            .Returns(true);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        _mockTokenService.Setup(x => x.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns("token");

        _mockTokenService.Setup(x => x.GenerateRefreshToken())
            .Returns("refresh");

        _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>()))
            .Returns(new UserDto(userId, user.Phone, "common"));

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);

        _mockUserRepo.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.FailedLoginAttempts == 0 &&
            u.LockedUntil == null), userId), Times.Once);
    }

    #endregion

    #region Logout Tests

    [Fact]
    public async Task LogoutAsync_ValidUser_RevokesTokensAndDeactivatesUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockUserRepo.Setup(x => x.UpdateAsync(It.IsAny<User>(), userId))
            .ReturnsAsync(true);

        _mockTokenService.Setup(x => x.RevokeRefreshTokenAsync(userId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _authService.LogoutAsync(userId);

        // Assert
        Assert.True(result);

        _mockUserRepo.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.IsActive == false), userId), Times.Once);

        _mockTokenService.Verify(x => x.RevokeRefreshTokenAsync(userId), Times.Once);
    }

    [Fact]
    public async Task LogoutAsync_UserNotFound_ReturnsFalse()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.LogoutAsync(userId);

        // Assert
        Assert.False(result);

        _mockUserRepo.Verify(x => x.UpdateAsync(It.IsAny<User>(), It.IsAny<Guid>()), Times.Never);
        _mockTokenService.Verify(x => x.RevokeRefreshTokenAsync(It.IsAny<Guid>()), Times.Never);
    }

    #endregion

    #region Refresh Token Tests

    [Fact]
    public async Task RefreshTokenAsync_ValidToken_ReturnsNewTokens()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var oldRefreshToken = "old_refresh_token";
        var newAccessToken = "new_access_token";
        var newRefreshToken = "new_refresh_token";

        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockTokenService.Setup(x => x.ValidateRefreshTokenAsync(userId, oldRefreshToken))
            .ReturnsAsync(oldRefreshToken);

        _mockTokenService.Setup(x => x.GenerateAccessToken(user.Phone, user.Role, userId))
            .Returns(newAccessToken);

        _mockTokenService.Setup(x => x.GenerateRefreshToken())
            .Returns(newRefreshToken);

        _mockTokenService.Setup(x => x.SaveRefreshTokenAsync(userId, newRefreshToken, It.IsAny<DateTime>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _authService.RefreshTokenAsync(userId, oldRefreshToken);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(newAccessToken, result.AccessToken);
        Assert.Equal(newRefreshToken, result.RefreshToken);

        _mockTokenService.Verify(x => x.SaveRefreshTokenAsync(userId, newRefreshToken, It.IsAny<DateTime>()), Times.Once);
    }

    [Fact]
    public async Task RefreshTokenAsync_InvalidToken_ReturnsNull()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var invalidRefreshToken = "invalid_token";

        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = "hashed_password",
            IsActive = true,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _mockTokenService.Setup(x => x.ValidateRefreshTokenAsync(userId, invalidRefreshToken))
            .ReturnsAsync((string?)null);

        // Act
        var result = await _authService.RefreshTokenAsync(userId, invalidRefreshToken);

        // Assert
        Assert.Null(result);

        _mockTokenService.Verify(x => x.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task RefreshTokenAsync_InactiveUser_ReturnsNull()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var refreshToken = "refresh_token";

        var user = new User
        {
            Id = userId,
            Phone = "+79991234567",
            Hash = "hashed_password",
            IsActive = false,
            Role = "common",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepo.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.RefreshTokenAsync(userId, refreshToken);

        // Assert
        Assert.Null(result);

        _mockTokenService.Verify(x => x.ValidateRefreshTokenAsync(It.IsAny<Guid>(), It.IsAny<string>()), Times.Never);
    }

    #endregion
}
