import { FastifyInstance } from "fastify";
import {
    createOrganizationHandler,
    getOrganizationHandler,
} from "./organizations.controllers";
import { createOrganizationJsonSchema } from "./organizations.schemas";

export async function organizationRoutes(app: FastifyInstance) {
    app.post(
        "/",
        {
            schema: createOrganizationJsonSchema,
        },
        createOrganizationHandler
    );

    app.get("/", getOrganizationHandler);
}
