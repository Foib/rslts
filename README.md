# rslts

## Robust, Type-Safe Error Handling for TypeScript

`rslts` brings Go-inspired, type-safe error handling to TypeScript

## Features

- **Go-Like Multiple Return Values**: Simulate Go's multiple return value pattern with a type-safe `Result` type
- **Comprehensive Error Handling**: Handle errors explicitly and avoid silent failures
- **Error Chaining**: Track the source of errors through the call stack

## Installation

```bash
npm install rslts
```

## Quick Example

```typescript
import { ok, err, Result } from "rslts";

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return err(new Error("Division by zero"));
  }
  return ok(a / b);
}

const result = divide(10, 2);
if (!result.success) {
  return console.error(result.error.message);
}
console.log(result.value); // 5
```

## Key Concepts

- **`Result<T, E>`**: A type that represents either a successful value or an error
- **`ok(value)`**: Create a successful result
- **`err(error)`**: Create an error result
- **Exhaustive Checking**: TypeScript forces you to handle both success and error cases

## License

MIT License
