
import dotenv from "dotenv";
import logger from "./config/logger";
import { shutdown } from "./services";
import app from "./app";

dotenv.config();

async function startServer() {
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

startServer();
