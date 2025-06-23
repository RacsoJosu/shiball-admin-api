CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "birthday_date" date,
  "fk_id_role" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "users_roles" (
  "fk_id_users" integer,
  "fk_id_roles" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "seed_history" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "status" varchar,
  "execute_date" timestamp,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "properties" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text,
  "capacity" integer,
  "type" enum(vehicle,house),
  "fk_id_user" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "vehicles" (
  "id" integer PRIMARY KEY,
  "license_plate" varchar,
  "brand" varchar,
  "model" varchar,
  "year" integer,
  "type" enum(hybrid,non-hybrid),
  "fk_id_property" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "houses" (
  "id" integer PRIMARY KEY,
  "city" varchar,
  "country" varchar,
  "address" varchar,
  "latitude" decimal,
  "longitude" decimal,
  "fk_id_property" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "services" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text,
  "is_free" boolean,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "rates" (
  "id" integer PRIMARY KEY,
  "type" enum(hour,day,month,quarter,semester,year),
  "price" decimal,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "property_rates" (
  "id" integer PRIMARY KEY,
  "fk_id_property" integer,
  "fk_id_rate" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "service_rates" (
  "id" integer PRIMARY KEY,
  "fk_id_service" integer,
  "fk_id_rate" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "reservations" (
  "id" integer PRIMARY KEY,
  "fk_id_user" integer,
  "fk_id_property_rate" integer,
  "start_date" timestamp,
  "end_date" timestamp,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "users_roles" ("fk_id_users");

ALTER TABLE "roles" ADD FOREIGN KEY ("id") REFERENCES "users_roles" ("fk_id_roles");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "properties" ("fk_id_user");

ALTER TABLE "properties" ADD FOREIGN KEY ("id") REFERENCES "vehicles" ("fk_id_property");

ALTER TABLE "properties" ADD FOREIGN KEY ("id") REFERENCES "houses" ("fk_id_property");

ALTER TABLE "properties" ADD FOREIGN KEY ("id") REFERENCES "property_rates" ("fk_id_property");

ALTER TABLE "rates" ADD FOREIGN KEY ("id") REFERENCES "property_rates" ("fk_id_rate");

ALTER TABLE "services" ADD FOREIGN KEY ("id") REFERENCES "service_rates" ("fk_id_service");

ALTER TABLE "rates" ADD FOREIGN KEY ("id") REFERENCES "service_rates" ("fk_id_rate");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "reservations" ("fk_id_user");

ALTER TABLE "property_rates" ADD FOREIGN KEY ("id") REFERENCES "reservations" ("fk_id_property_rate");
