export type ActionResult<T = undefined> =
  | { success: true; message?: string; data?: T }
  | { success: false; message: string };

export function ok<T = undefined>(message?: string, data?: T): ActionResult<T> {
  return { success: true, message, data };
}

export function fail(message: string): ActionResult<never> {
  return { success: false, message };
}
