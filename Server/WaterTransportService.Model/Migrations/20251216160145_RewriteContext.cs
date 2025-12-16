using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class RewriteContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "port_images",
                keyColumn: "id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.DeleteData(
                table: "port_images",
                keyColumn: "id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"));

            migrationBuilder.DeleteData(
                table: "port_images",
                keyColumn: "id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"));

            migrationBuilder.DeleteData(
                table: "port_images",
                keyColumn: "id",
                keyValue: new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"));

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ship_types",
                keyColumn: "id",
                keyValue: 8);

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

            migrationBuilder.DeleteData(
                table: "port_types",
                keyColumn: "id",
                keyValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "port_types",
                columns: new[] { "id", "title" },
                values: new object[,]
                {
                    { 1, "Морской" },
                    { 2, "Речной" },
                    { 3, "Эстуарный" },
                    { 4, "Русловой" },
                    { 5, "Бассейновый" },
                    { 6, "Закрытый" },
                    { 7, "Пирсовый" }
                });

            migrationBuilder.InsertData(
                table: "ship_types",
                columns: new[] { "id", "description", "name" },
                values: new object[,]
                {
                    { 1, null, "Яхта" },
                    { 2, null, "Парусная лодка" },
                    { 3, null, "Моторная лодка" },
                    { 4, null, "Паром" },
                    { 5, null, "Гидроцикл" },
                    { 6, null, "Баржа" },
                    { 7, null, "Буксир" },
                    { 8, null, "Резиновая лодка" }
                });

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

            migrationBuilder.InsertData(
                table: "port_images",
                columns: new[] { "id", "created_at", "image_path", "is_primary", "PortId", "updated_at", "uploaded_at" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 12, 16, 15, 36, 46, 368, DateTimeKind.Utc).AddTicks(1997), "/Images/Ports/30672607-23ef-41a8-b005-39b8ff78021f.jpg", true, new Guid("11111111-1111-1111-1111-111111111111"), null, new DateTime(2025, 12, 16, 15, 28, 55, 0, DateTimeKind.Utc) },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new DateTime(2025, 12, 16, 15, 36, 46, 368, DateTimeKind.Utc).AddTicks(4278), "/Images/Ports/35eb072a-42bd-4f59-aeed-cdf3607bcaf1.jpg", true, new Guid("22222222-2222-2222-2222-222222222222"), null, new DateTime(2025, 12, 16, 15, 28, 55, 0, DateTimeKind.Utc) },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), new DateTime(2025, 12, 16, 15, 36, 46, 368, DateTimeKind.Utc).AddTicks(4286), "/Images/Ports/5a57b2d1-309a-4bba-a225-4d043f39c8e3.jpg", true, new Guid("33333333-3333-3333-3333-333333333333"), null, new DateTime(2025, 12, 16, 15, 28, 55, 0, DateTimeKind.Utc) },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 12, 16, 15, 36, 46, 368, DateTimeKind.Utc).AddTicks(4291), "/Images/Ports/42af05e2-513b-4159-8898-c65800dd1a14.jpg", true, new Guid("44444444-4444-4444-4444-444444444444"), null, new DateTime(2025, 12, 16, 15, 28, 55, 0, DateTimeKind.Utc) }
                });
        }
    }
}
