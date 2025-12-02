/**
 * Common types for server actions
 */

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ActionResponse<T = unknown> = Promise<ActionResult<T>>;
