import { FastifyReply, FastifyRequest } from "fastify";
import { CreateOrganizationBody } from "./organizations.schemas";
import { createOrganization, getOrganizations } from "./organizations.services";
import { createRole } from "../roles/roles.services";
import {
    All_PERMISSIONS,
    SYSTEM_ROLES,
    USER_ROLE_PERMISSIONS,
} from "../../config/permissions";

/**
 * Handler for creating a new organization.
 * @param request - FastifyRequest containing request data.
 * @param reply - FastifyReply for sending the response.
 * @returns An object containing the created organization.
 */
export async function createOrganizationHandler(
    request: FastifyRequest<{
        Body: CreateOrganizationBody;
    }>,
    reply: FastifyReply
) {
    // Extract the 'name' field from the request body.
    const { name } = request.body;

    // Call the 'createOrganization' service function to create the organization.
    const organization = await createOrganization({ name });

    const superAdminRolePromise = createRole({
        organizationId: organization.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions: All_PERMISSIONS as unknown as Array<string>,
    });

    const applicationUserRolePromise = createRole({
        organizationId: organization.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions: USER_ROLE_PERMISSIONS,
    });

    const [superAdminRole, applicationUserRole] = await Promise.allSettled([
        superAdminRolePromise,
        applicationUserRolePromise,
    ]);

    if (superAdminRole.status === "rejected") {
        throw new Error("Error creating super admin role");
    }

    if (applicationUserRole.status === "rejected") {
        throw new Error("Error creating organization user role");
    }

    // Return the created organization as a response.
    return {
        organization,
        superAdminRole: superAdminRole.value,
        applicationUserRole: applicationUserRole.value,
    };
}

export async function getOrganizationHandler() {
    return getOrganizations();
}
