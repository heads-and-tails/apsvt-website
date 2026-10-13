# APSVT agent instructions

The APSVT website is production software. Complete every task through validation,
pull-request merge, production deployment, and live verification.

After every change, merge its pull request and deploy it to production; do not leave
completed work only on a local branch or preview deployment.

## Mandatory worktree workflow

- Never edit in the primary checkout or another agent's folder.
- Use one task, branch, and sibling worktree folder per agent, based on the latest
  `origin/main`:

```bash
git fetch origin
git worktree add ../apsvt-worktrees/<agent>-<task> \
  -b agent/<agent>-<task> origin/main
cd ../apsvt-worktrees/<agent>-<task>
npm ci
```

- One agent owns that worktree and branch until the task is merged.
- Coordinate before editing files owned by another active task. Serialize changes
  to the same component, stylesheet, migration, or shared data module.
- Never switch, reset, stash, clean, rebase, delete, or force-push another agent's
  work. Preserve all changes you did not create.

## Website structure and conventions

- This repository is the public Next.js/vinext website. Routes and UI components
  live in `app/`, shared data and authentication code in `lib/`, database definitions
  in `db/`, migrations in `drizzle/` and `supabase/migrations/`, static content in
  `public/`, and integration tests in `tests/`. Run package commands from this
  repository's root.
- Use TypeScript, ES modules, and two-space indentation. Follow the existing file's
  semicolon and double-quote conventions. Use `PascalCase` for React components
  and exported types, `camelCase` for functions and variables, and lowercase
  kebab-case for route directories.
- Keep data, persistence, and business logic in focused modules instead of
  expanding page components.
- Website tests use `node:test`; name new tests `*.test.mjs` under `tests/`.
  Add regression coverage for affected routing, generated HTML, and server behavior.

## Implementation rules

- Read `README.md` and `package.json`; check `git status --short --branch` before editing.
- Make the smallest complete change. Do not include unrelated cleanup or formatting.
- Preserve the current design and responsive behavior unless redesign is requested.
- Do not invent institutional facts. Preserve Ukrainian copy unless editing or
  translation is requested, and verify shared changes in Ukrainian and English.
- Never commit secrets or expose server-only values through `NEXT_PUBLIC_` variables.
- Add new database migrations; never rewrite an applied migration.
- Do not alter auth, authorization, CI, deployment, or security as a side effect.

## Validation strategy before implementation

- Before editing, write a task-specific validation strategy in the task update or
  working notes. Define the expected result and acceptance criteria, affected
  routes and shared components, likely regressions, and the checks that will prove
  the change works. Scale the plan to the change; do not rely on a generic checklist.
- Choose automated checks and browser scenarios in advance, including relevant
  desktop and mobile viewport sizes, Ukrainian and English variants, interactions,
  and loading, empty, or error states when affected. Identify representative pages
  that could regress when a shared component changes.
- For visual changes, inspect the existing rendered pages and capture baseline
  screenshots before editing. State what should change and what should be preserved.
- For changes without a visual effect, explain why screenshot checks are not
  applicable and identify the direct functional or document checks instead.

## Required validation

After each change, execute the planned checks against the final revision. Before
committing, run:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build:vercel
```

- Run additional tests and browser scenarios from the validation strategy. Verify
  the complete affected flow and its result, not just that a page loads or a build
  succeeds. Check the browser console and failed network requests.
- For UI or content changes that affect rendered pages, capture fresh screenshots
  of the affected pages at the planned desktop and mobile sizes. Open and directly
  inspect the screenshot images; saving screenshots, reading HTML, or passing
  automated tests alone does not count as visual validation.
- Compare the screenshots with the acceptance criteria and baseline. Check layout,
  spacing, typography, Ukrainian and English text wrapping, image loading and
  cropping, navigation, responsive behavior, clipping, overlap, and horizontal
  overflow. Inspect full-page images and close-ups of changed areas as needed.
- Exercise affected controls and inspect screenshots of relevant resulting states.
  For shared UI changes, also inspect representative pages that use the component.
- Fix every defect found within the task's scope, then rerun affected checks and
  capture and inspect new screenshots after the fix. Before committing, review the
  final diff and confirm every acceptance criterion has supporting evidence.
- Record actual commands and outcomes, tested routes and viewport sizes, screenshot
  locations, and any unresolved pre-existing issues. Disclose checks that could not
  run; never describe an unperformed check as passed.
- If `origin/main` changed, integrate it into the task branch and rerun all checks.
- Never merge or deploy with failing or skipped required checks.

## Merge and deploy every completed change

1. Review the full diff against `origin/main`; remove generated and unrelated files.
2. Use a short, imperative, sentence-case commit subject and keep the commit scoped
   to one logical change. Push the task branch and open a pull request with the
   result, tests, screenshots, migrations, environment changes, risks, and
   unverified areas.
3. Satisfy branch protection, required checks, and review. Do not bypass them.
4. Merge the pull request into `main` after it is approved and green. Each completed
   change must be merged independently; do not batch unrelated tasks.
5. Monitor every configured production deployment triggered from `main` until it
   succeeds. Then smoke-test the affected production URL and behavior. For changes
   affecting rendered pages, capture and directly inspect fresh production screenshots
   at desktop and mobile sizes to confirm the deployed result matches the validated
   change. Verify the deployment belongs to the resulting `main` commit.
6. Do not report completion until the merge commit is on `main`, production is live,
   and the live check passes. Report the PR, merge commit, deployment, and verification.

If credentials, branch protection, required review, or deployment access blocks a
step, leave a ready-to-merge PR and report the exact blocker. Never claim a merge or
deployment that you did not verify.

After the branch is merged and its work is preserved, remove its worktree with
`git worktree remove <path>` and run `git worktree prune` from the primary checkout.
