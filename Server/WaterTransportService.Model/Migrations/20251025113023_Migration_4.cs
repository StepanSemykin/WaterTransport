using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class Migration_4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rent_calendars_users_UserUuid",
                table: "rent_calendars");

            migrationBuilder.RenameColumn(
                name: "UserUuid",
                table: "rent_calendars",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_rent_calendars_UserUuid",
                table: "rent_calendars",
                newName: "IX_rent_calendars_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_rent_calendars_users_UserId",
                table: "rent_calendars",
                column: "UserId",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rent_calendars_users_UserId",
                table: "rent_calendars");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "rent_calendars",
                newName: "UserUuid");

            migrationBuilder.RenameIndex(
                name: "IX_rent_calendars_UserId",
                table: "rent_calendars",
                newName: "IX_rent_calendars_UserUuid");

            migrationBuilder.AddForeignKey(
                name: "FK_rent_calendars_users_UserUuid",
                table: "rent_calendars",
                column: "UserUuid",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
