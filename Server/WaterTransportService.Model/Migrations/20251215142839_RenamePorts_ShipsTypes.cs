using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class RenamePorts_ShipsTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 1,
                column: "title",
                value: "Морской");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 2,
                column: "title",
                value: "Речной");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 3,
                column: "title",
                value: "Эстуарный");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 4,
                column: "title",
                value: "Русловой");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 5,
                column: "title",
                value: "Бассейновый");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 6,
                column: "title",
                value: "Закрытый");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 7,
                column: "title",
                value: "Пирсовый");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Яхта");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 2,
                column: "name",
                value: "Парусная лодка");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Моторная лодка");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 4,
                column: "name",
                value: "Паром");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "Гидроцикл");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 6,
                column: "name",
                value: "Баржа");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 7,
                column: "name",
                value: "Буксир");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 8,
                column: "name",
                value: "Резиновая лодка");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 1,
                column: "title",
                value: "Marine");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 2,
                column: "title",
                value: "Riverine");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 3,
                column: "title",
                value: "Estuaries");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 4,
                column: "title",
                value: "Riverbed");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 5,
                column: "title",
                value: "BucketPools");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 6,
                column: "title",
                value: "Closed");

            migrationBuilder.UpdateData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 7,
                column: "title",
                value: "FormedByPiers");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Yacht");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 2,
                column: "name",
                value: "Sailboat");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Motorboat");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 4,
                column: "name",
                value: "Ferry");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "JetSki");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 6,
                column: "name",
                value: "Barge");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 7,
                column: "name",
                value: "Tugboat");

            migrationBuilder.UpdateData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 8,
                column: "name",
                value: "RubberDinghy");
        }
    }
}
