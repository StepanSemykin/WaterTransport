using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class AddPortIdAndRentOrderIdToReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "reviews",
                newName: "is_active");

            migrationBuilder.AddColumn<Guid>(
                name: "port_id",
                table: "reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "rent_order_id",
                table: "reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_port_id",
                table: "reviews",
                column: "port_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_rent_order_id",
                table: "reviews",
                column: "rent_order_id");

            migrationBuilder.AddForeignKey(
                name: "FK_reviews_ports_port_id",
                table: "reviews",
                column: "port_id",
                principalTable: "ports",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_reviews_rent_orders_rent_order_id",
                table: "reviews",
                column: "rent_order_id",
                principalTable: "rent_orders",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reviews_ports_port_id",
                table: "reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_reviews_rent_orders_rent_order_id",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "IX_reviews_port_id",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "IX_reviews_rent_order_id",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "port_id",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "rent_order_id",
                table: "reviews");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "reviews",
                newName: "IsActive");
        }
    }
}
