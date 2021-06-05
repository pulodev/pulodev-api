-- -------------------------------------------------------------
-- TablePlus 3.12.8(368)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2021-06-05 08:12:15.1820
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."contents" (
    "id" int4 NOT NULL,
    "title" varchar NOT NULL,
    "url" varchar NOT NULL,
    "body" text,
    "tags" varchar DEFAULT 'bebas'::character varying,
    "media" varchar NOT NULL,
    "thumbnail" varchar,
    "owner" varchar,
    "draft" bool NOT NULL DEFAULT true,
    "original_published_at" timestamp NOT NULL DEFAULT now(),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "deleted_at" timestamp,
    "source_id" int4,
    "contributor" varchar,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."sources" (
    "id" int4 NOT NULL,
    "title" varchar NOT NULL,
    "url" varchar NOT NULL,
    "draft" bool NOT NULL DEFAULT true,
    "media" varchar NOT NULL DEFAULT 'tulisan'::character varying,
    "last_checked_at" timestamp,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    "contributor" varchar,
    "deleted_at" timestamptz,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."contents" ADD FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id");
