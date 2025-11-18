using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class Migration_3_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "rent_orders",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    total_price = table.Column<long>(type: "bigint", nullable: false),
                    number_of_passengers = table.Column<int>(type: "integer", nullable: false),
                    rent_calendar_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rental_start_time = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    rental_end_time = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    order_date = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    cancelled_at = table.Column<DateTime>(type: "timestamptz", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rent_orders", x => x.id);
                    table.ForeignKey(
                        name: "FK_rent_orders_rent_calendars_rent_calendar_id",
                        column: x => x.rent_calendar_id,
                        principalTable: "rent_calendars",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rent_orders_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_rent_calendar_id",
                table: "rent_orders",
                column: "rent_calendar_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_user_id",
                table: "rent_orders",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "rent_orders");
        }
    }
}
