import {
    pgTable,
    uniqueIndex,
    primaryKey,
    uuid,
    text,
    timestamp,
    varchar,
    PrimaryKey,
} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable(
    "users",
    {
        id: uuid("id").defaultRandom().notNull(),
        email: varchar("email", { length: 256 }).notNull(),
        name: varchar("name", { length: 256 }).notNull(),
        organizationId: uuid("organizationId").references(
            () => organizations.id
        ),
        password: varchar("password", { length: 256 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (users) => {
        return {
            cpk: primaryKey(users.email, users.organizationId),
            idIndex: uniqueIndex("users_id_index").on(users.id),
        };
    }
);

export const roles = pgTable(
    "roles",
    {
        id: uuid("id").defaultRandom().notNull(),
        name: varchar("name", { length: 256 }).notNull(),
        organizationId: uuid("organizationId").references(
            () => organizations.id
        ),
        permissions: text("permissions").array().$type<Array<string>>(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (roles) => {
        return {
            cpk: primaryKey(roles.name, users.organizationId),
            idIndex: uniqueIndex("roles_id_index").on(roles.id),
        };
    }
);

export const usersToRoles = pgTable(
    "usersToRoles",
    {
        organizationId: uuid("organizationId")
            .references(() => organizations.id)
            .notNull(),
        roleId: uuid("roleId")
            .references(() => roles.id)
            .notNull(),
        userId: uuid("userId")
            .references(() => users.id)
            .notNull(),
    },
    (usersToRoles) => {
        return {
            cpk: primaryKey(
                usersToRoles.organizationId,
                usersToRoles.roleId,
                usersToRoles.userId
            ),
        };
    }
);
