using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class AddShipRentalCalendar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "regular_orders");

            migrationBuilder.DropTable(
                name: "regular_calendars");

            migrationBuilder.DropTable(
                name: "routes");

            migrationBuilder.CreateTable(
                name: "ship_rental_calendar",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rent_order_id = table.Column<Guid>(type: "uuid", nullable: false),
                    departure_port_id = table.Column<Guid>(type: "uuid", nullable: true),
                    arrival_port_id = table.Column<Guid>(type: "uuid", nullable: true),
                    start_time = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    end_time = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamptz", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ship_rental_calendar", x => x.id);
                    table.ForeignKey(
                        name: "FK_ship_rental_calendar_rent_orders_rent_order_id",
                        column: x => x.rent_order_id,
                        principalTable: "rent_orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ship_rental_calendar_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ship_rental_calendar_rent_order_id",
                table: "ship_rental_calendar",
                column: "rent_order_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ship_rental_calendar_ship_id",
                table: "ship_rental_calendar",
                column: "ship_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ship_rental_calendar");

            migrationBuilder.CreateTable(
                name: "routes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    from_port_id = table.Column<Guid>(type: "uuid", nullable: false),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    to_port_id = table.Column<Guid>(type: "uuid", nullable: true),
                    cost = table.Column<double>(type: "numeric(10,2)", nullable: false),
                    duration_minutes = table.Column<TimeSpan>(type: "interval", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_routes", x => x.id);
                    table.ForeignKey(
                        name: "FK_routes_ports_from_port_id",
                        column: x => x.from_port_id,
                        principalTable: "ports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_routes_ports_to_port_id",
                        column: x => x.to_port_id,
                        principalTable: "ports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_routes_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "regular_calendars",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    route_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    arrived_at = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    departure_at = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_regular_calendars", x => x.id);
                    table.ForeignKey(
                        name: "FK_regular_calendars_routes_route_id",
                        column: x => x.route_id,
                        principalTable: "routes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_regular_calendars_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "regular_orders",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    calendar_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cancelled_at = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    number_of_passengers = table.Column<int>(type: "integer", nullable: false),
                    order_date = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    total_price = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_regular_orders", x => x.id);
                    table.ForeignKey(
                        name: "FK_regular_orders_regular_calendars_calendar_id",
                        column: x => x.calendar_id,
                        principalTable: "regular_calendars",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_regular_orders_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_regular_calendars_route_id",
                table: "regular_calendars",
                column: "route_id");

            migrationBuilder.CreateIndex(
                name: "IX_regular_calendars_user_id",
                table: "regular_calendars",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_regular_orders_calendar_id",
                table: "regular_orders",
                column: "calendar_id");

            migrationBuilder.CreateIndex(
                name: "IX_regular_orders_user_id",
                table: "regular_orders",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_routes_from_port_id",
                table: "routes",
                column: "from_port_id");

            migrationBuilder.CreateIndex(
                name: "IX_routes_ship_id",
                table: "routes",
                column: "ship_id");

            migrationBuilder.CreateIndex(
                name: "IX_routes_to_port_id",
                table: "routes",
                column: "to_port_id");
        }
    }
}
