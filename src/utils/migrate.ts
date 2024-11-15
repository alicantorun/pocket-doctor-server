import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db";
import { logger } from "./logger";

async function main() {
    logger.info("Starting migration...");

    try {
        // Log the migration folder path
        logger.info("Migration folder:", process.cwd() + "/migrations");

        // Log the database connection (without sensitive info)
        logger.info("Database connected:", !!db);

        await migrate(db, {
            migrationsFolder: "./migrations",
        });

        logger.info("Migration completed successfully");
        process.exit(0);
    } catch (error) {
        // More detailed error logging
        logger.error("Migration failed with error:", {
            name: error instanceof Error ? error.name : "Unknown",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        // If it's a database error, it might have additional properties
        if (error && typeof error === "object" && "code" in error) {
            logger.error("Database error code:", (error as any).code);
        }

        process.exit(1);
    }
}

// Catch any unhandled promise rejections
process.on("unhandledRejection", (error) => {
    logger.error("Unhandled rejection:", error);
    process.exit(1);
});

main();
