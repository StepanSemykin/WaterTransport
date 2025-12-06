using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WaterTransportService.Model.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "port_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_port_types", x => x.id);
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
                name: "ship_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ship_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    nickname = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    last_login_at = table.Column<DateTime>(type: "timestamp", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    failed_login_attempts = table.Column<int>(type: "integer", nullable: true),
                    locked_until = table.Column<DateTime>(type: "timestamp", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ports",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    port_type_id = table.Column<int>(type: "integer", nullable: false),
                    latitude = table.Column<double>(type: "double precision", nullable: false),
                    longitude = table.Column<double>(type: "double precision", nullable: false),
                    address = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ports", x => x.id);
                    table.ForeignKey(
                        name: "FK_ports_port_types_port_type_id",
                        column: x => x.port_type_id,
                        principalTable: "port_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "passwords",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    salt = table.Column<string>(type: "text", nullable: false),
                    hash = table.Column<string>(type: "text", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "users_profiles",
                columns: table => new
                {
                    user_uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    last_name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    patronymic = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    birthday = table.Column<DateTime>(type: "date", nullable: true),
                    about = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    location = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    is_public = table.Column<bool>(type: "boolean", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_profiles", x => x.user_uuid);
                    table.ForeignKey(
                        name: "FK_users_profiles_users_user_uuid",
                        column: x => x.user_uuid,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "port_images",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    PortId = table.Column<Guid>(type: "uuid", nullable: false),
                    image_path = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: false),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_port_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_port_images_ports_PortId",
                        column: x => x.PortId,
                        principalTable: "ports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ships",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ship_type_id = table.Column<int>(type: "integer", nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: false),
                    registration_number = table.Column<string>(type: "character varying(11)", maxLength: 11, nullable: false),
                    year_of_manufacture = table.Column<DateTime>(type: "timestamp", nullable: true),
                    power = table.Column<int>(type: "integer", nullable: true),
                    engine = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    max_speed = table.Column<int>(type: "integer", nullable: true),
                    width = table.Column<int>(type: "integer", nullable: true),
                    length = table.Column<int>(type: "integer", nullable: true),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    cost_per_hour = table.Column<long>(type: "bigint", nullable: true),
                    port_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ships", x => x.id);
                    table.ForeignKey(
                        name: "FK_ships_ports_port_id",
                        column: x => x.port_id,
                        principalTable: "ports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ships_ship_types_ship_type_id",
                        column: x => x.ship_type_id,
                        principalTable: "ship_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ships_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_images",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    image_path = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: false),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    UserProfileUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_images_users_profiles_UserProfileUserId",
                        column: x => x.UserProfileUserId,
                        principalTable: "users_profiles",
                        principalColumn: "user_uuid");
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    author_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: true),
                    comment = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    rating = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.id);
                    table.ForeignKey(
                        name: "FK_reviews_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_reviews_users_author_id",
                        column: x => x.author_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reviews_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "routes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    from_port_id = table.Column<Guid>(type: "uuid", nullable: false),
                    to_port_id = table.Column<Guid>(type: "uuid", nullable: true),
                    cost = table.Column<double>(type: "numeric(10,2)", nullable: false),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    duration_minutes = table.Column<TimeSpan>(type: "interval", nullable: true),
                    route_type_id = table.Column<int>(type: "integer", nullable: false)
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
                        name: "FK_routes_route_types_route_type_id",
                        column: x => x.route_type_id,
                        principalTable: "route_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_routes_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ship_images",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    ship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    image_path = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: false),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ship_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_ship_images_ships_ship_id",
                        column: x => x.ship_id,
                        principalTable: "ships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "calendars",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    route_id = table.Column<Guid>(type: "uuid", nullable: false),
                    departure_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    arrived_at = table.Column<DateTime>(type: "timestamp", nullable: true),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_calendars", x => x.id);
                    table.ForeignKey(
                        name: "FK_calendars_calendar_statuses_status_id",
                        column: x => x.status_id,
                        principalTable: "calendar_statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_calendars_routes_route_id",
                        column: x => x.route_id,
                        principalTable: "routes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_calendars_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    total_price = table.Column<long>(type: "bigint", nullable: false),
                    number_of_passengers = table.Column<int>(type: "integer", nullable: false),
                    calendar_id = table.Column<Guid>(type: "uuid", nullable: false),
                    order_date = table.Column<DateTime>(type: "timestamp", nullable: false),
                    booking_status_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false),
                    cancelled_at = table.Column<DateTime>(type: "timestamp", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.id);
                    table.ForeignKey(
                        name: "FK_bookings_booking_statuses_booking_status_id",
                        column: x => x.booking_status_id,
                        principalTable: "booking_statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookings_calendars_calendar_id",
                        column: x => x.calendar_id,
                        principalTable: "calendars",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookings_users_user_id",
                        column: x => x.user_id,
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
                table: "port_types",
                columns: new[] { "id", "title" },
                values: new object[,]
                {
                    { 1, "Marine" },
                    { 2, "Riverine" },
                    { 3, "Estuaries" },
                    { 4, "Riverbed" },
                    { 5, "BucketPools" },
                    { 6, "Closed" },
                    { 7, "FormedByPiers" }
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

            migrationBuilder.InsertData(
                table: "ship_types",
                columns: new[] { "id", "description", "name" },
                values: new object[,]
                {
                    { 1, null, "Yacht" },
                    { 2, null, "Sailboat" },
                    { 3, null, "Motorboat" },
                    { 4, null, "Ferry" },
                    { 5, null, "JetSki" },
                    { 6, null, "Barge" },
                    { 7, null, "Tugboat" },
                    { 8, null, "RubberDinghy" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_booking_status_id",
                table: "bookings",
                column: "booking_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_calendar_id",
                table: "bookings",
                column: "calendar_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_user_id",
                table: "bookings",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_calendars_route_id",
                table: "calendars",
                column: "route_id");

            migrationBuilder.CreateIndex(
                name: "IX_calendars_status_id",
                table: "calendars",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_calendars_user_id",
                table: "calendars",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_passwords_user_id",
                table: "passwords",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_port_images_PortId",
                table: "port_images",
                column: "PortId");

            migrationBuilder.CreateIndex(
                name: "IX_ports_port_type_id",
                table: "ports",
                column: "port_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_author_id",
                table: "reviews",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_ship_id",
                table: "reviews",
                column: "ship_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_user_id",
                table: "reviews",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_RoleUser_UsersUuid",
                table: "RoleUser",
                column: "UsersUuid");

            migrationBuilder.CreateIndex(
                name: "IX_routes_from_port_id",
                table: "routes",
                column: "from_port_id");

            migrationBuilder.CreateIndex(
                name: "IX_routes_route_type_id",
                table: "routes",
                column: "route_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_routes_ship_id",
                table: "routes",
                column: "ship_id");

            migrationBuilder.CreateIndex(
                name: "IX_routes_to_port_id",
                table: "routes",
                column: "to_port_id");

            migrationBuilder.CreateIndex(
                name: "IX_ship_images_ship_id",
                table: "ship_images",
                column: "ship_id");

            migrationBuilder.CreateIndex(
                name: "IX_ships_port_id",
                table: "ships",
                column: "port_id");

            migrationBuilder.CreateIndex(
                name: "IX_ships_ship_type_id",
                table: "ships",
                column: "ship_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_ships_user_id",
                table: "ships",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_images_UserProfileUserId",
                table: "user_images",
                column: "UserProfileUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "passwords");

            migrationBuilder.DropTable(
                name: "port_images");

            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "RoleUser");

            migrationBuilder.DropTable(
                name: "ship_images");

            migrationBuilder.DropTable(
                name: "user_images");

            migrationBuilder.DropTable(
                name: "booking_statuses");

            migrationBuilder.DropTable(
                name: "calendars");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "users_profiles");

            migrationBuilder.DropTable(
                name: "calendar_statuses");

            migrationBuilder.DropTable(
                name: "routes");

            migrationBuilder.DropTable(
                name: "route_types");

            migrationBuilder.DropTable(
                name: "ships");

            migrationBuilder.DropTable(
                name: "ports");

            migrationBuilder.DropTable(
                name: "ship_types");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "port_types");
        }
    }
}
