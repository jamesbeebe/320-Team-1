import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ClassMatch API",
      version: "1.0.0",
      description: "This is the API documentation for the ClassMatch backend.",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "auth", "routes.js"),
    path.join(__dirname, "chat", "routes.js"),
    path.join(__dirname, "classes", "routes.js"),
    path.join(__dirname, "ics", "routes.js"),
    path.join(__dirname, "messages", "routes.js"),
    path.join(__dirname, "study-groups", "routes.js"),
    path.join(__dirname, "user_chats", "routes.js"),
    path.join(__dirname, "users", "routes.js"),
  ],
};
