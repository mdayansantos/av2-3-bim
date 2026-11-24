export default {
  openapi: "3.0.3",
  info: {
    title: "Marketplace API",
    version: "1.0.0",
    description: "API for marketplace users, stores and products",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/health": {
      get: {
        security: [],
        responses: { 200: { description: "Service is healthy" } },
      },
    },
    "/auth/register": {
      post: {
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: { 201: { description: "User registered" } },
      },
    },
    "/auth/login": {
      post: {
        security: [],
        responses: { 200: { description: "Authentication successful" } },
      },
    },
    "/auth/me": {
      get: { responses: { 200: { description: "Current user" } } },
    },
    "/stores": {
      get: {
        security: [],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { 200: { description: "Paginated stores" } },
      },
      post: { responses: { 201: { description: "Store created" } } },
    },
    "/products": {
      get: {
        security: [],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { 200: { description: "Paginated products" } },
      },
      post: { responses: { 201: { description: "Product created" } } },
    },
  },
};
