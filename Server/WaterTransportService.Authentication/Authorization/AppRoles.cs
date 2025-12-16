namespace WaterTransportService.Authentication.Authorization;

/// <summary>
/// Централизованный список поддерживаемых ролей приложения.
/// </summary>
public static class AppRoles
{
    public const string Common = "common";
    public const string Partner = "partner";
    public const string Admin = "admin";

    public const string AnyAuthenticated = Admin + "," + Partner + "," + Common;
    public const string PartnerOrAdmin = Partner + "," + Admin;
    public const string CommonOrAdmin = Common + "," + Admin;
}
