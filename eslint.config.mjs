import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/\\\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]",
          message: "[Theme] Raw Tailwind palette class detected. Use semantic tokens instead.",
        },
        {
          selector: "Literal[value=/\\\\b(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|w|h|top|bottom|left|right|inset)-(3|5|7|9|10|11|13|14|15|18|19|20|22|26|28)\\b/]",
          message: "[Theme] Off-grid spacing detected. Use the strict 8pt grid (2, 4, 6, 8, etc.) with 1 (4px) as the only permitted half-step.",
        },
        {
          selector: "Literal[value=/\\\\b(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|w|h|top|bottom|left|right|inset)-\\\\[.*?\\\\].*?/]",
          message: "[Theme] Arbitrary spacing values are banned. Use the strict 8pt grid scale.",
        },
        {
          selector: "Literal[value=/\\\\btext-(lg|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\\b/]",
          message: "[Theme] Banned typography size. Use the Tight Editorial scale (xs, sm, base, xl). text-2xl is allowed ONLY for StatDisplays.",
        },
        {
          selector: "Literal[value=/\\\\btext-\\\\[.*?\\\\].*?/]",
          message: "[Theme] Arbitrary typography sizes are banned. Use the Tight Editorial scale.",
        }
      ]
    }
  }
]);

export default eslintConfig;
