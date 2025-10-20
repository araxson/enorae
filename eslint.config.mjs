import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Downgrade no-explicit-any from error to warning for intentional database type workarounds
      "@typescript-eslint/no-explicit-any": "warn",

      // Ban legacy layout component imports (migration to shadcn/ui complete)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/layout/*"],
              message:
                "Legacy layout components (@/components/layout) are deprecated. Use semantic HTML + Tailwind utility classes or shadcn/ui Card components instead.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
