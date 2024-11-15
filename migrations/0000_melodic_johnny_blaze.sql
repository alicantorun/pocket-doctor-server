CREATE TABLE IF NOT EXISTS "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"organizationId" uuid,
	"permissions" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT roles_name_organizationId PRIMARY KEY("name","organizationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"organizationId" uuid,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT users_email_organizationId PRIMARY KEY("email","organizationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersToRoles" (
	"organizationId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT usersToRoles_organizationId_roleId_userId PRIMARY KEY("organizationId","roleId","userId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roles_id_index" ON "roles" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_id_index" ON "users" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
