import { describe, it, expect } from "bun:test";
import { err, ok, Result } from "../src";

// Custom error for testing
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

// Divide function for testing
function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return err(new Error("Division by zero"));
  }
  return ok(a / b);
}

describe("Result Type Utilities", () => {
  // Basic Result Creation Tests
  describe("ok() function", () => {
    it("should create a successful result", () => {
      const result = ok(42);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    it("should work with different types", () => {
      const stringResult = ok("hello");
      const objectResult = ok({ name: "Test" });

      expect(stringResult.success).toBe(true);
      expect(objectResult.success).toBe(true);
    });
  });

  describe("err() function", () => {
    it("should create an error result", () => {
      const error = new Error("Test error");
      const result = err(error);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(error);
      }
    });

    it("should work with custom error types", () => {
      const customError = new CustomError("Custom test error");
      const result = err(customError);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customError);
        expect(result.error).toBeInstanceOf(CustomError);
      }
    });
  });

  // Practical Function Tests
  describe("Error Handling Scenarios", () => {
    it("should handle successful division", () => {
      const result = divide(10, 2);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(5);
      }
    });

    it("should handle division by zero", () => {
      const result = divide(10, 0);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Division by zero");
      }
    });
  });

  // Async Error Handling Tests
  describe("Async Error Handling", () => {
    async function fetchUserData(userId: number): Promise<Result<string>> {
      if (userId <= 0) {
        return err(new Error("Invalid user ID"));
      }

      try {
        // Simulated async operation
        const mockData = userId === 1 ? "User Data" : null;

        if (mockData === null) {
          return err(new Error("User not found"));
        }

        return ok(mockData);
      } catch (error) {
        return err(error instanceof Error ? error : new Error("Unknown error"));
      }
    }

    it("should handle successful async operation", async () => {
      const result = await fetchUserData(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe("User Data");
      }
    });

    it("should handle async error scenarios", async () => {
      const invalidIdResult = await fetchUserData(0);
      const notFoundResult = await fetchUserData(2);

      expect(invalidIdResult.success).toBe(false);
      expect(notFoundResult.success).toBe(false);

      if (!invalidIdResult.success) {
        expect(invalidIdResult.error.message).toBe("Invalid user ID");
      }

      if (!notFoundResult.success) {
        expect(notFoundResult.error.message).toBe("User not found");
      }
    });
  });

  // Error Chaining Tests
  describe("Error Chaining", () => {
    function complexOperation(input: number): Result<number, Error> {
      const divideResult = divide(10, input);

      if (!divideResult.success) {
        return err(
          new Error("Complex operation failed", {
            cause: divideResult.error,
          })
        );
      }

      return ok(divideResult.value * 2);
    }

    it("should support error chaining", () => {
      const successResult = complexOperation(2);
      const errorResult = complexOperation(0);

      expect(successResult.success).toBe(true);
      expect(errorResult.success).toBe(false);

      if (successResult.success) {
        expect(successResult.value).toBe(10);
      }

      if (!errorResult.success) {
        expect(errorResult.error.message).toBe("Complex operation failed");
        expect(errorResult.error.cause).toBeDefined();
      }
    });
  });

  // Type Guard and Inference Tests
  describe("Type Safety", () => {
    it("should narrow types correctly", () => {
      const result: Result<number, CustomError> = ok(42);

      if (result.success) {
        // This should compile without type errors
        const value: number = result.value;
        expect(value).toBe(42);
      } else {
        // This should compile without type errors
        const error: CustomError = result.error;
        expect(error).toBeInstanceOf(CustomError);
      }
    });
  });
});
