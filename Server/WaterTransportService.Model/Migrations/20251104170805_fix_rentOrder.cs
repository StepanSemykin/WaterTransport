using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class fix_rentOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_rent_calendars_rent_calendar_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_users_user_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_user_images_users_profiles_UserProfileUserId",
                table: "user_images");

            migrationBuilder.DropTable(
                name: "rent_calendars");

            migrationBuilder.DropIndex(
                name: "IX_user_images_UserProfileUserId",
                table: "user_images");

            migrationBuilder.DropIndex(
                name: "IX_rent_orders_rent_calendar_id",
                table: "rent_orders");

            migrationBuilder.DropColumn(
                name: "UserProfileUserId",
                table: "user_images");

            migrationBuilder.DropColumn(
                name: "rent_calendar_id",
                table: "rent_orders");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "users",
                newName: "role");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "rent_orders",
                newName: "status");

            migrationBuilder.AddColumn<Guid>(
                name: "user_profile_id",
                table: "user_images",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "partner_id",
                table: "rent_orders",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ship_id",
                table: "rent_orders",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_images_user_profile_id",
                table: "user_images",
                column: "user_profile_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_partner_id",
                table: "rent_orders",
                column: "partner_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_ship_id",
                table: "rent_orders",
                column: "ship_id");

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_ships_ship_id",
                table: "rent_orders",
                column: "ship_id",
                principalTable: "ships",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_users_partner_id",
                table: "rent_orders",
                column: "partner_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_users_user_id",
                table: "rent_orders",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_user_images_users_profiles_user_profile_id",
                table: "user_images",
                column: "user_profile_id",
                principalTable: "users_profiles",
                principalColumn: "user_uuid",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_ships_ship_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_users_partner_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_users_user_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_user_images_users_profiles_user_profile_id",
                table: "user_images");

            migrationBuilder.DropIndex(
                name: "IX_user_images_user_profile_id",
                table: "user_images");

            migrationBuilder.DropIndex(
                name: "IX_rent_orders_partner_id",
                table: "rent_orders");

            migrationBuilder.DropIndex(
                name: "IX_rent_orders_ship_id",
                table: "rent_orders");

            migrationBuilder.DropColumn(
                name: "user_profile_id",
                table: "user_images");

            migrationBuilder.DropColumn(
                name: "partner_id",
                table: "rent_orders");

            migrationBuilder.DropColumn(
                name: "ship_id",
                table: "rent_orders");

            migrationBuilder.RenameColumn(
                name: "role",
                table: "users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "rent_orders",
                newName: "name");

            migrationBuilder.AddColumn<Guid>(
                name: "UserProfileUserId",
                table: "user_images",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "rent_calendar_id",
                table: "rent_orders",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "rent_calendars",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    high_time_limit = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    lower_time_limit = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rent_calendars", x => x.id);
                    table.ForeignKey(
                        name: "FK_rent_calendars_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rent_calendars_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_images_UserProfileUserId",
                table: "user_images",
                column: "UserProfileUserId");

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_rent_calendar_id",
                table: "rent_orders",
                column: "rent_calendar_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_calendars_ship_id",
                table: "rent_calendars",
                column: "ship_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_calendars_UserId",
                table: "rent_calendars",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_rent_calendars_rent_calendar_id",
                table: "rent_orders",
                column: "rent_calendar_id",
                principalTable: "rent_calendars",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_users_user_id",
                table: "rent_orders",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_images_users_profiles_UserProfileUserId",
                table: "user_images",
                column: "UserProfileUserId",
                principalTable: "users_profiles",
                principalColumn: "user_uuid");
        }
    }
}
