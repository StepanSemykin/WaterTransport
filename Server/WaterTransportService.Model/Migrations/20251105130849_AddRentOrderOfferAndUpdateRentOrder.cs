using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class AddRentOrderOfferAndUpdateRentOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "arrival_port_id",
                table: "rent_orders",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "departure_port_id",
                table: "rent_orders",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "ship_type_id",
                table: "rent_orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "rent_order_offers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    rent_order_id = table.Column<Guid>(type: "uuid", nullable: false),
                    partner_id = table.Column<Guid>(type: "uuid", nullable: false),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    offered_price = table.Column<long>(type: "bigint", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    responded_at = table.Column<DateTime>(type: "timestamptz", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rent_order_offers", x => x.id);
                    table.ForeignKey(
                        name: "FK_rent_order_offers_rent_orders_rent_order_id",
                        column: x => x.rent_order_id,
                        principalTable: "rent_orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rent_order_offers_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_rent_order_offers_users_partner_id",
                        column: x => x.partner_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_arrival_port_id",
                table: "rent_orders",
                column: "arrival_port_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_departure_port_id",
                table: "rent_orders",
                column: "departure_port_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_orders_ship_type_id",
                table: "rent_orders",
                column: "ship_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_order_offers_partner_id",
                table: "rent_order_offers",
                column: "partner_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_order_offers_rent_order_id",
                table: "rent_order_offers",
                column: "rent_order_id");

            migrationBuilder.CreateIndex(
                name: "IX_rent_order_offers_ship_id",
                table: "rent_order_offers",
                column: "ship_id");

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_ports_arrival_port_id",
                table: "rent_orders",
                column: "arrival_port_id",
                principalTable: "ports",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_ports_departure_port_id",
                table: "rent_orders",
                column: "departure_port_id",
                principalTable: "ports",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_rent_orders_ship_types_ship_type_id",
                table: "rent_orders",
                column: "ship_type_id",
                principalTable: "ship_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_ports_arrival_port_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_ports_departure_port_id",
                table: "rent_orders");

            migrationBuilder.DropForeignKey(
                name: "FK_rent_orders_ship_types_ship_type_id",
                table: "rent_orders");

            migrationBuilder.DropTable(
                name: "rent_order_offers");

            migrationBuilder.DropIndex(
                name: "IX_rent_orders_arrival_port_id",
                table: "rent_orders");

            migrationBuilder.DropIndex(
                name: "IX_rent_orders_departure_port_id",
                table: "rent_orders");

            migrationBuilder.DropIndex(
                name: "IX_rent_orders_ship_type_id",
                table: "rent_orders");

            migrationBuilder.DropColumn(
                name: "arrival_port_id",
                table: "rent_orders");

            migrationBuilder.DropColumn(
                name: "departure_port_id",
                table: "rent_orders");

            migrationBuilder.DropColumn(
                name: "ship_type_id",
                table: "rent_orders");
        }
    }
}
