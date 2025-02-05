import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  prettier, // Desactiva reglas conflictivas de ESLint
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error", // Muestra errores si el código no sigue Prettier
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];


