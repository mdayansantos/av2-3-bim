import { describe, expect, it } from "vitest";
import {
  createProductSchema,
  createStoreSchema,
  registerSchema,
} from "../src/validation/schemas.js";

describe("request schemas", () => {
  it("accepts valid registration data", () => {
    expect(
      registerSchema.parse({
        body: {
          name: "Matheus",
          email: "MATHEUS@example.com",
          password: "password123",
        },
      }).body.email,
    ).toBe("matheus@example.com");
  });

  it("rejects negative product prices", () => {
    expect(() =>
      createProductSchema.parse({
        body: { name: "Keyboard", price: -10, storeId: 1 },
      }),
    ).toThrow();
  });

  it("requires a store name", () => {
    expect(() =>
      createStoreSchema.parse({
        body: { name: "" },
      }),
    ).toThrow();
  });
});
