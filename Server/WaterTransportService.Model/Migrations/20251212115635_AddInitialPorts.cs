using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialPorts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("0fe3211d-f90f-48ec-b874-63fb7c687a40"));

            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("54838bb4-3f57-422e-8291-99fe888cba53"));

            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("a7b54b5f-7339-496e-bf6c-66713b1b6155"));

            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("df15e55d-a28f-44fc-bdf8-9856176d6e03"));

            migrationBuilder.InsertData(
                table: "ports",
                columns: new[] { "id", "address", "latitude", "longitude", "port_type_id", "title" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Городской округ Самара, Ленинский район", 53.202202999999997, 50.097633999999999, 2, "Дебаркадер Старая пристань" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Городской округ Самара, Ленинский район", 53.205553000000002, 50.105007999999998, 2, "Пристань ФАУ МО РФ ЦСКА" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Городской округ Самара, Самарский район", 53.188515000000002, 50.079847000000001, 2, "Речной вокзал Самара – причал СВП" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Городской округ Самара, Самарский район", 53.189053000000001, 50.078383000000002, 2, "Речной вокзал Самара – причал №1" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "ports",
                keyColumn: "id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.InsertData(
                table: "ports",
                columns: new[] { "id", "address", "latitude", "longitude", "port_type_id", "title" },
                values: new object[,]
                {
                    { new Guid("0fe3211d-f90f-48ec-b874-63fb7c687a40"), "Городской округ Самара, Ленинский район", 53.202202999999997, 50.097633999999999, 2, "Дебаркадер Старая пристань" },
                    { new Guid("54838bb4-3f57-422e-8291-99fe888cba53"), "Городской округ Самара, Самарский район", 53.188515000000002, 50.079847000000001, 2, "Речной вокзал Самара – причал СВП" },
                    { new Guid("a7b54b5f-7339-496e-bf6c-66713b1b6155"), "Городской округ Самара, Самарский район", 53.189053000000001, 50.078383000000002, 2, "Речной вокзал Самара – причал №1" },
                    { new Guid("df15e55d-a28f-44fc-bdf8-9856176d6e03"), "Городской округ Самара, Ленинский район", 53.205553000000002, 50.105007999999998, 2, "Пристань ФАУ МО РФ ЦСКА" }
                });
        }
    }
}
