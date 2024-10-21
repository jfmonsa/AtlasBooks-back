import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";

export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      "jest/expect-expect": "error",
      "jest/lowercase-name": [
        "error",
        {
          ignore: ["describe"],
        },
      ],
      "jest/no-disabled-tests": "error",
      "jest/no-done-callback": "error",
      "jest/no-duplicate-hooks": "error",
      "jest/no-conditional-expect": "error",
      "jest/no-export": "error",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/no-interpolation-in-snapshots": "error",
      "jest/no-jasmine-globals": "error",
      "jest/no-jest-import": "error",
      "jest/no-large-snapshots": "error",
      "jest/no-mocks-import": "error",
      "jest/no-standalone-expect": "error",
      "jest/no-test-prefixes": "error",
      "jest/valid-describe": "error",
      "jest/valid-expect-in-promise": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];

// useful links:
// + https://prettier.io/docs/en/integrating-with-linters.html
// + https://dev.to/alexyang/jest-best-practice-1-use-eslint-plugin-jest-o7e
