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

## Implementation rules

- Read `README.md` and `package.json`; check `git status --short --branch` before editing.
- Make the smallest complete change. Do not include unrelated cleanup or formatting.
- Preserve the current design and responsive behavior unless redesign is requested.
- Do not invent institutional facts. Preserve Ukrainian copy unless editing or
  translation is requested, and verify shared changes in Ukrainian and English.
- Never commit secrets or expose server-only values through `NEXT_PUBLIC_` variables.
- Add new database migrations; never rewrite an applied migration.
- Do not alter auth, authorization, CI, deployment, or security as a side effect.

## Required validation

Before committing, run:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build:vercel
```

- Run additional relevant tests. For UI changes, inspect desktop and mobile views,
  check the browser console, and capture screenshots.
- If `origin/main` changed, integrate it into the task branch and rerun all checks.
- Never merge or deploy with failing or skipped required checks.

## Merge and deploy every completed change

1. Review the full diff against `origin/main`; remove generated and unrelated files.
2. Commit, push the task branch, and open a pull request with the result, tests,
   screenshots, migrations, environment changes, risks, and unverified areas.
3. Satisfy branch protection, required checks, and review. Do not bypass them.
4. Merge the pull request into `main` after it is approved and green. Each completed
   change must be merged independently; do not batch unrelated tasks.
5. Monitor every configured production deployment triggered from `main` until it
   succeeds. Then smoke-test the affected production URL and behavior.
6. Do not report completion until the merge commit is on `main`, production is live,
   and the live check passes. Report the PR, merge commit, deployment, and verification.

If credentials, branch protection, required review, or deployment access blocks a
step, leave a ready-to-merge PR and report the exact blocker. Never claim a merge or
deployment that you did not verify.

After the branch is merged and its work is preserved, remove its worktree with
`git worktree remove <path>` and run `git worktree prune` from the primary checkout.
