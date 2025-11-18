using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class Migration_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "booking_statuses",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1L, "AwaitingPayment" },
                    { 2L, "AwaitingConfirmation" },
                    { 3L, "Confirmed" },
                    { 4L, "Cancelled" },
                    { 5L, "Completed" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 5L);
        }
    }
}
