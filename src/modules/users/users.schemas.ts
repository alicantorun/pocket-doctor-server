import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    organizationId: z.string().uuid(),
    password: z.string().min(6),
    initialUser: z.boolean().optional(),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export const createUserJsonSchema = {
    body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema"),
};

// Login
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    organizationId: z.string(),
});
export type LoginBody = z.infer<typeof loginSchema>;
export const LoginJsonSchema = {
    body: zodToJsonSchema(loginSchema, "loginSchema"),
};

// Assign role to user
const assignRoleToUserBody = z.object({
    userId: z.string().uuid(),
    roleId: z.string().uuid(),
    organizationId: z.string().uuid(),
});
export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserBody>;

export const assignRoleToUserJsonSchema = {
    body: zodToJsonSchema(assignRoleToUserBody, "assignRoleToUserBody"),
};
