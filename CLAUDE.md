# AI Assistant Instructions for UI/UX & Styling

When generating or modifying React components in this project, you MUST strictly adhere to the project's Design System. Failure to follow these rules will result in broken themes and rejected PRs.

## 1. NEVER use raw Tailwind colors
**BANNED:** `slate-*`, `gray-*`, `zinc-*`, `neutral-*`, `stone-*`, `red-*`, `orange-*`, `amber-*`, `yellow-*`, `lime-*`, `green-*`, `emerald-*`, `teal-*`, `cyan-*`, `sky-*`, `blue-*`, `indigo-*`, `violet-*`, `purple-*`, `fuchsia-*`, `pink-*`, `rose-*`.
**BANNED:** Hardcoded hex codes (e.g., `color: '#ff0000'`).

## 2. ALWAYS use Semantic Tokens
* **Surfaces:** `bg-background`, `bg-card`, `bg-muted`, `bg-popover`
* **Text:** `text-foreground`, `text-muted-foreground`, `text-card-foreground`
* **Borders/Interactive:** `border-border`, `ring-ring`
* **Brand/Action:** `bg-primary`, `text-primary`, `bg-accent`

## 3. Semantic Status Rules
Never invent status colors. Use the exact token combinations:
* **Success (Published, Easy):** `text-success bg-success/10`
* **Warning (Draft, Medium):** `text-warning bg-warning/10`
* **Destructive (Deleted, Hard):** `text-destructive bg-destructive/10`
* **Info:** `text-info bg-info/10`

## 4. Subject Color Rules
Never use primary brand colors for subject identification. Use the specific subject tokens with `/10` background tint:
* `text-subject-quant bg-subject-quant/10`
* `text-subject-english bg-subject-english/10`
* `text-subject-ga bg-subject-ga/10`
* `text-subject-reason bg-subject-reason/10`
* `text-subject-science bg-subject-science/10`

## 5. UI Architecture Rules
* **No `dark:` modifiers for colors:** Semantic tokens automatically adjust for dark mode. Do not write `<div className="bg-white dark:bg-black" />`. Write `<div className="bg-card" />`.
* **Cards (Admin):** Must use explicit `rounded-xl` instead of generic `rounded-lg` or token-driven radii.
* **Focus States:** Never use `outline-none` without replacing it. Always use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
* **Gradients (Admin):** Strictly banned. Use flat colors and semantic surfaces.

For the complete and absolute source of truth, ALWAYS review `docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md` before making architectural UI decisions.

## 6. QuestionRenderer (KaTeX)
Whenever you need to render strings containing LaTeX math (`$$...$$`, `\[...\]`, or `\(...\)`), you MUST use the `QuestionRenderer` component from `@/components/ui/question-renderer`. Do NOT write custom math parsers, use `dangerouslySetInnerHTML` directly for math, or rely on client-side DOM mutation libraries like `auto-render`.
* **Usage:** `<QuestionRenderer content={htmlString} />`
* The component pre-processes the string for robust hydration and styling without React DOM mutation clashes.

## 7. Strict TypeScript Typings (NO `any`)
**CRITICAL RULE:** You MUST NEVER use the `any` type in TypeScript.
* Use strict types (interfaces, types, generics) for all variables, function parameters, and return types.
* If a type is truly unknown, use the `unknown` type and perform proper type narrowing.
* Use `Record<string, unknown>` for generic objects.
* Never silence TypeScript errors by casting to `any`. Use proper types or `unknown`.

## 8. React Hooks: No `setState` in `useEffect`
**CRITICAL RULE:** Do not call state setters synchronously inside `useEffect`. This triggers cascading renders and causes the `react-hooks/set-state-in-effect` lint error.
* **Bad:** Setting state based on a prop change inside an effect.
* **Good:** Derive the state during the render phase directly, or use a `key` on the component to force a reset.
* State updates inside `useEffect` are only allowed if they happen asynchronously (e.g., inside `.then()` or after an `await` of an API call) or as a reaction to an event listener.

## 9. TypeScript: Type-Only Imports
When `verbatimModuleSyntax` or `isolatedModules` is enabled, you **MUST** import types using the `import type` syntax (e.g., `import type { MyInterface } from './types'`). This ensures types are safely stripped during compilation.

## 10. Imports: Path Aliases
Always use the project's path aliases (e.g., `@/lib/axios`, `@/components/ui/...`) instead of guessing relative paths (e.g., `../../lib/axios`). This prevents broken imports when files are moved.
