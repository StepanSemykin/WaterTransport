using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class delete_salt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "salt",
                table: "users");

            migrationBuilder.DropColumn(
                name: "salt",
                table: "old_passwords");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "salt",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "salt",
                table: "old_passwords",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
