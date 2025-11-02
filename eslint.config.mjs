import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Downgrade no-explicit-any from error to warning for intentional database type workarounds
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "always",
        },
      ],
    },
  },
  {
    rules: {
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
