import { InferInsertModel, and, eq } from "drizzle-orm";
import { db } from "../../db";
import { roles } from "../../db/schema";

export async function createRole(data: InferInsertModel<typeof roles>) {
    const result = await db.insert(roles).values(data).returning();

    return result[0];
}

export async function getRoleByName({
    name,
    organizationId,
}: {
    name: string;
    organizationId: string;
}) {
    // SELECT * FROM roles
    const result = await db
        .select()
        .from(roles)
        .where(
            // WHERE name = ? AND organizationId = ?
            and(eq(roles.name, name), eq(roles.organizationId, organizationId))
        )
        .limit(1);

    return result[0];
}
