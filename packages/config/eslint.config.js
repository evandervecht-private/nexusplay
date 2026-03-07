// @ts-check
import tseslint from "typescript-eslint";

/**
 * Shared ESLint 9 flat config base.
 * Apps extend this and set their own `project` path.
 */
export const base = tseslint.config(
  {
    ignores: ["dist/**", ".next/**", "node_modules/**", "coverage/**"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  }
);

export default base;
