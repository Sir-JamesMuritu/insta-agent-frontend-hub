import logger from "./config/logger";
import { shutdown } from "./services";
import app from "./app";
import { connectDB } from "./config/db";

async function startServer() {
  const isDatabaseConnected = await connectDB();
  if (!isDatabaseConnected) {
    logger.warn("Starting API without database access; database-backed features are unavailable.");
  }

  const port = process.env.PORT || 3001;
  
  const server = app.listen(port, () => {
    logger.info(`API Server is running on port ${port}`);
    logger.info(`Health check available at http://localhost:${port}/api/health`);
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM signal.");
    shutdown(server);
  });
  
  process.on("SIGINT", () => {
    logger.info("Received SIGINT signal.");
    shutdown(server);
  });

}

startServer().catch((error: unknown) => {
  logger.error("API server startup failed:", error);
  process.exitCode = 1;
});
