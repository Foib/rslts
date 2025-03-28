type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function ok<T>(value: T): Result<T> {
  return { success: true, value };
}

function err<E = Error>(error: E): Result<any, E> {
  return { success: false, error };
}

export { type Result, ok, err };
