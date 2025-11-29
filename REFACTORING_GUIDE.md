# Capybook Refactoring Guide

This document outlines the improvements made to the Capybook codebase and provides migration guidance.

## 🎯 Overview

The refactoring focused on:
1. **Improved Project Structure** - Better organization with clear separation of concerns
2. **Modernized Components** - Better reusability and organization
3. **Enhanced Server Actions** - Stronger validation and error handling
4. **Improved Hooks** - Better typing, documentation, and consistency
5. **Modernized Styling** - Consistent patterns and better UX

## 📁 New Project Structure

### `/lib` Directory Structure

```
lib/
├── actions/          # Server actions with validation
│   ├── auth.ts
│   └── types.ts
├── db/              # Database utilities
│   ├── prisma.ts
│   ├── queries.ts
│   └── helpers.ts
├── helpers/          # General utilities
│   ├── api.ts
│   ├── format.ts
│   ├── validation.ts
│   ├── color.ts
│   └── password.ts
├── services/        # Business logic services
│   ├── book.ts
│   └── review.ts
└── validators/      # Zod validation schemas
    ├── auth.ts
    ├── book.ts
    ├── challenge.ts
    ├── note.ts
    ├── profile.ts
    ├── review.ts
    └── admin.ts
```

### `/components` Directory Structure

```
components/
├── ui/              # Presentational primitives (existing)
├── common/           # App-wide shared components
└── [feature]/        # Feature-specific components
```

## 🔄 Migration Guide

### Import Path Updates

#### Validators
**Old:**
```typescript
import { SignInSchema, SignUpSchema } from "@/utils/zod";
```

**New:**
```typescript
import { SignInSchema, SignUpSchema } from "@/lib/validators";
// Or import specific validators:
import { SignInSchema } from "@/lib/validators/auth";
```

#### Database
**Old:**
```typescript
import prisma from "@/utils/prisma";
```

**New:**
```typescript
import prisma from "@/lib/db/prisma";
```

#### API Helpers
**Old:**
```typescript
import { api } from "@/utils/api";
import { fetcher } from "@/utils/fetcher";
```

**New:**
```typescript
import { api, fetcher } from "@/lib/helpers/api";
```

#### Password Utilities
**Old:**
```typescript
import { saltAndHashPassword } from "@/utils/password";
```

**New:**
```typescript
import { hashPassword, comparePassword } from "@/lib/helpers/password";
```

#### Format Utilities
**Old:**
```typescript
import { formatList, formatUsername } from "@/utils/format";
```

**New:**
```typescript
import { formatList, formatUsername } from "@/lib/helpers/format";
```

#### Color Utilities
**Old:**
```typescript
import { generateGradientClasses } from "@/utils/color";
```

**New:**
```typescript
import { generateGradientClasses } from "@/lib/helpers/color";
```

### Server Actions

Server actions now use a consistent return type:

```typescript
type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };
```

**Example:**
```typescript
// Old
export async function signUp(formData: unknown) {
  try {
    // ...
    return { message: "Success" };
  } catch {
    return { error: "Error message" };
  }
}

// New
export async function signUp(formData: unknown): ActionResponse<{ message: string }> {
  try {
    // ...
    return { success: true, data: { message: "Success" } };
  } catch (error) {
    return { success: false, error: "Error message" };
  }
}
```

### Hooks

Hooks now include:
- JSDoc documentation
- Explicit return types
- Better error handling

**Example:**
```typescript
/**
 * Custom hook for managing user data
 *
 * @returns User data, loading states, and refresh function
 */
export function useUser(): UseUserReturn {
  // Implementation
}
```

## ✅ Completed Improvements

### 1. Project Structure ✅
- ✅ Created `/lib/validators` with organized schema files
- ✅ Created `/lib/db` for database utilities
- ✅ Created `/lib/helpers` for utility functions
- ✅ Created `/lib/services` for business logic
- ✅ Created `/lib/actions` for server actions

### 2. Hooks ✅
- ✅ Improved `useUser` with better typing and JSDoc
- ✅ Improved `useBooks` with better typing and JSDoc
- ✅ Improved `useChallenges` with better typing and JSDoc

### 3. Server Actions ✅
- ✅ Refactored auth actions with better error handling
- ✅ Added consistent return types

### 4. Validators ✅
- ✅ Organized validators into domain-specific files
- ✅ Maintained backward compatibility

## 🚧 Remaining Tasks

### High Priority
1. **Update all imports** across the codebase to use new paths
2. **Refactor remaining server actions** in `/actions` directory
3. **Update API routes** to use new validation helpers
4. **Reorganize components** into `common/` and feature directories

### Medium Priority
1. **Add loading/empty/error states** to components missing them
2. **Modernize styling** with consistent spacing and typography
3. **Extract repeated patterns** into reusable components

### Low Priority
1. **Add JSDoc** to remaining functions
2. **Remove dead code** and unused files
3. **Update documentation** with new patterns

## 📝 Files to Update

### Critical Files (Update First)
- [ ] `actions/reviews.ts` - Update imports
- [ ] `actions/book.ts` - Update imports
- [ ] `actions/statistics.ts` - Update imports
- [ ] `actions/daily-book.ts` - Update imports
- [ ] `actions/admin/crud.ts` - Update imports
- [ ] All files in `app/api/` - Update imports

### Component Files
- [ ] `components/Auth/RegisterForm.tsx` - Update validator imports
- [ ] `components/Profile/EditProfile/EditProfileModal.tsx` - Update validator imports
- [ ] `components/Challenges/**` - Update validator imports
- [ ] `components/BookStore/**` - Update validator imports

### Utility Files
- [ ] `utils/database.ts` - Migrate to `/lib/db/queries.ts`
- [ ] `utils/readingStats.ts` - Consider moving to `/lib/services`
- [ ] `utils/badges.ts` - Consider moving to `/lib/services`

## 🔍 Search & Replace Patterns

Use these patterns to find and update imports:

1. **Find:** `from "@/utils/zod"`
   **Replace:** `from "@/lib/validators"`

2. **Find:** `from "@/utils/prisma"`
   **Replace:** `from "@/lib/db/prisma"`

3. **Find:** `from "@/utils/api"`
   **Replace:** `from "@/lib/helpers/api"`

4. **Find:** `from "@/utils/fetcher"`
   **Replace:** `from "@/lib/helpers/api"`

5. **Find:** `saltAndHashPassword`
   **Replace:** `hashPassword`

## 🎨 Styling Improvements

### Typography Scale
- Use consistent text sizes: `text-sm`, `text-base`, `text-lg`, `text-xl`
- Maintain consistent line heights

### Spacing
- Use Tailwind spacing scale consistently
- Prefer `gap-*` for flex/grid layouts
- Use `p-*` and `m-*` consistently

### Component States
- Add hover states to interactive elements
- Add focus states for accessibility
- Add disabled states where appropriate

## 📚 Best Practices

### Server Actions
- Always validate input with Zod schemas
- Use consistent return types (`ActionResult`)
- Handle errors gracefully
- Log errors for debugging

### Hooks
- Document with JSDoc
- Use explicit return types
- Memoize expensive computations
- Handle loading and error states

### Components
- Extract reusable logic to hooks
- Use TypeScript for props
- Add loading/error/empty states
- Keep components focused and small

## 🚀 Next Steps

1. Run the project and fix any import errors
2. Update imports systematically using the patterns above
3. Test each feature after migration
4. Update component organization
5. Modernize styling patterns

## 📞 Support

If you encounter issues during migration:
1. Check the new file structure matches the guide
2. Verify import paths are correct
3. Check TypeScript errors for type mismatches
4. Review the examples in the new structure

---

**Last Updated:** 2024
**Version:** 1.0
