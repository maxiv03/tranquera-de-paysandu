import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Symbols allowed as JSX text. Anything else a user can read must come from messages/*.json.
const allowedStrings = ["·", "—", "–", "/", "|", "×", "•", ":", "+", "US$", "#"];

// Attributes a user can read or hear: they must be translated too.
const translatableAttributes = [
  "alt",
  "title",
  "placeholder",
  "aria-label",
  "aria-description",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.tsx"],
    rules: {
      "react/jsx-no-literals": [
        "error",
        { noStrings: true, ignoreProps: true, allowedStrings },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: `JSXAttribute[name.name=/^(${translatableAttributes.join("|")})$/] > Literal[value=/[A-Za-zÁÉÍÓÚáéíóúñÑ]/]`,
          message:
            "Interface text must come from next-intl messages, not a string literal.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
