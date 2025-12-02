/**
 * Database validation and helper functions
 */

/**
 * Validates that an ID is provided and is a non-empty string
 */
export function validateId(id: string | undefined, fieldName: string): asserts id is string {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error(`${fieldName} is required and must be a non-empty string`);
  }
}

/**
 * Validates that a user cannot perform an action on themselves
 */
export function validateNotSelfAction(
  currentUserId: string,
  targetUserId: string,
  actionName: string = "cette action"
): void {
  if (currentUserId === targetUserId) {
    throw new Error(`Vous ne pouvez pas ${actionName} sur vous-même`);
  }
}
