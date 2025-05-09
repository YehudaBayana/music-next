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
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json", // Use the paths from tsconfig.json
        },
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // Add React Hooks rules with higher severity
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error", // Changed from default warning to error
      
      // Disable the regular no-unused-vars rule
      "no-unused-vars": "off",
      
      // Use TypeScript version instead, with args set to "none" to ignore interface parameters
      "@typescript-eslint/no-unused-vars": [
        "error", 
        { 
          "vars": "all", 
          "varsIgnorePattern": "^_",
          "args": "none", // This is the key setting - don't check function parameters at all
          "ignoreRestSiblings": true,
          "caughtErrors": "none"
        }
      ]
    }
  },
];

export default eslintConfig;
