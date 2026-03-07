import { base } from "@nexusplay/config/eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(...base, {
  // Next.js App Router uses async page components — params/searchParams are async in Next 15+
  rules: {
    "@typescript-eslint/require-await": "off",
  },
});
