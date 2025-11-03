using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class PravkiPopova : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookings_booking_statuses_booking_status_id",
                table: "bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_calendars_calendar_statuses_status_id",
                table: "calendars");

            migrationBuilder.DropForeignKey(
                name: "FK_routes_route_types_route_type_id",
                table: "routes");

            migrationBuilder.DropTable(
                name: "booking_statuses");

            migrationBuilder.DropTable(
                name: "calendar_statuses");

            migrationBuilder.DropTable(
                name: "passwords");

            migrationBuilder.DropTable(
                name: "RoleUser");

            migrationBuilder.DropTable(
                name: "route_types");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropIndex(
                name: "IX_routes_route_type_id",
                table: "routes");

            migrationBuilder.DropIndex(
                name: "IX_calendars_status_id",
                table: "calendars");

            migrationBuilder.DropIndex(
                name: "IX_bookings_booking_status_id",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "users_profiles");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "user_images");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ship_images");

            migrationBuilder.DropColumn(
                name: "route_type_id",
                table: "routes");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "port_images");

            migrationBuilder.DropColumn(
                name: "status_id",
                table: "calendars");

            migrationBuilder.DropColumn(
                name: "booking_status_id",
                table: "bookings");

            migrationBuilder.AddColumn<int[]>(
                name: "Roles",
                table: "users",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);

            migrationBuilder.AddColumn<string>(
                name: "hash",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "salt",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<byte>(
                name: "rating",
                table: "reviews",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "calendars",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "bookings",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "old_passwords",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    salt = table.Column<string>(type: "text", nullable: false),
                    hash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_old_passwords", x => x.id);
                    table.ForeignKey(
                        name: "FK_old_passwords_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_old_passwords_user_id",
                table: "old_passwords",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "old_passwords");

            migrationBuilder.DropColumn(
                name: "Roles",
                table: "users");

            migrationBuilder.DropColumn(
                name: "hash",
                table: "users");

            migrationBuilder.DropColumn(
                name: "salt",
                table: "users");

            migrationBuilder.DropColumn(
                name: "name",
                table: "calendars");

            migrationBuilder.DropColumn(
                name: "name",
                table: "bookings");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "users_profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "user_images",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ship_images",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "route_type_id",
                table: "routes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<long>(
                name: "rating",
                table: "reviews",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "smallint");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "port_images",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "status_id",
                table: "calendars",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "booking_status_id",
                table: "bookings",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "booking_statuses",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "calendar_statuses",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_calendar_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "passwords",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    hash = table.Column<string>(type: "text", nullable: false),
                    salt = table.Column<string>(type: "text", nullable: false),
                    version = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_passwords", x => x.id);
                    table.ForeignKey(
                        name: "FK_passwords_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "route_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "RoleUser",
                columns: table => new
                {
                    RolesId = table.Column<long>(type: "bigint", nullable: false),
                    UsersUuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleUser", x => new { x.RolesId, x.UsersUuid });
                    table.ForeignKey(
                        name: "FK_RoleUser_roles_RolesId",
                        column: x => x.RolesId,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleUser_users_UsersUuid",
                        column: x => x.UsersUuid,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "calendar_statuses",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Planned" },
                    { 2, "OnTheWay" },
                    { 3, "Completed" },
                    { 4, "Cancelled" },
                    { 5, "Available" },
                    { 6, "PartiallyAvailable" },
                    { 7, "Unavailable" },
                    { 8, "Blocked" }
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1L, "User" },
                    { 2L, "Admin" },
                    { 3L, "Partner" }
                });

            migrationBuilder.InsertData(
                table: "route_types",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Rental" },
                    { 2, "FixedRoute" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_routes_route_type_id",
                table: "routes",
                column: "route_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_calendars_status_id",
                table: "calendars",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_booking_status_id",
                table: "bookings",
                column: "booking_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_passwords_user_id",
                table: "passwords",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_RoleUser_UsersUuid",
                table: "RoleUser",
                column: "UsersUuid");

            migrationBuilder.AddForeignKey(
                name: "FK_bookings_booking_statuses_booking_status_id",
                table: "bookings",
                column: "booking_status_id",
                principalTable: "booking_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_calendars_calendar_statuses_status_id",
                table: "calendars",
                column: "status_id",
                principalTable: "calendar_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_routes_route_types_route_type_id",
                table: "routes",
                column: "route_type_id",
                principalTable: "route_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
