import { InferInsertModel, and, eq } from "drizzle-orm";
import { organizations, roles, users, usersToRoles } from "../../db/schema";
import { db } from "../../db";
import argon2 from "argon2";

export async function createUser(data: InferInsertModel<typeof users>) {
    const hashedPassword = await argon2.hash(data.password);

    const result = await db
        .insert(users)
        .values({
            ...data,
            password: hashedPassword,
        })
        .returning({
            id: users.id,
            email: users.email,
            name: users.name,
            applicationsId: organizations.id,
        });

    return result[0];
}

export async function getUsersByApplication(organizationId: string) {
    return await db
        .select()
        .from(users)
        .where(eq(users.organizationId, organizationId));
}

export async function assignRoleToUser(
    data: InferInsertModel<typeof usersToRoles>
) {
    const result = await db.insert(usersToRoles).values(data).returning();
    return result[0];
}

export async function getUserByEmail({
    email,
    organizationId,
}: {
    email: string;
    organizationId: string;
}) {
    const result = await db
        .select({
            id: users.id,
            email: users.email,
            name: users.name,
            applicationid: users.organizationId,
            roleId: roles.id,
            password: users.password,
            permissions: roles.permissions,
        })
        .from(users)
        .where(
            and(
                eq(users.email, email),
                eq(users.organizationId, organizationId)
            )
        )
        .leftJoin(
            usersToRoles,
            and(
                eq(usersToRoles.userId, users.id),
                eq(usersToRoles.organizationId, users.organizationId)
            )
        )
        .leftJoin(roles, eq(roles.id, usersToRoles.roleId));

    if (!result.length) {
        return null;
    }

    const user = result.reduce((acc, curr) => {
        if (!acc.id) {
            return {
                ...curr,
                permissions: new Set(curr.permissions),
            };
        }

        if (!curr.permissions) {
            return acc;
        }

        for (const permission of curr.permissions) {
            acc.permissions.add(permission);
        }

        return acc;
    }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

    return {
        ...user,
        permissions: Array.from(user.permissions),
    };
}
