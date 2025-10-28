---
applyTo: '**'
description: 'Git workflow, commit conventions, branching strategy, and PR guidelines'
---

# Git Workflow & Commit Conventions

## Branch Strategy

### Main branches

- `main` - Production-ready code
- `develop` - Integration branch for features (optional)

### Feature branches

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/property-filters

# Create bugfix branch
git checkout -b fix/session-timer-bug

# Create hotfix branch (urgent production fixes)
git checkout -b hotfix/security-patch
```

### Branch naming conventions

```
feature/<short-description>     # New features
fix/<short-description>          # Bug fixes
hotfix/<short-description>       # Urgent production fixes
chore/<short-description>        # Maintenance tasks
docs/<short-description>         # Documentation only
refactor/<short-description>     # Code refactoring
test/<short-description>         # Test additions/fixes
```

**Examples:**

- `feature/add-property-search`
- `fix/navigation-crash`
- `chore/update-dependencies`
- `docs/update-readme`

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring (no functional changes)
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependency updates
- `ci` - CI/CD configuration changes
- `build` - Build system or dependencies

### Scope (optional but recommended)

- `auth` - Authentication
- `properties` - Property management
- `sessions` - Cleaning sessions
- `ui` - UI components
- `nav` - Navigation
- `db` - Database
- `api` - API/service layer

### Examples

```bash
# Good commit messages
feat(properties): add search filter by location
fix(sessions): correct timer calculation for breaks
docs(readme): update installation instructions
refactor(services): extract validation logic
test(properties): add unit tests for propertyService
chore(deps): update expo-router to v3.0.0

# With body and footer
feat(auth): implement biometric authentication

Add Face ID and fingerprint authentication support for iOS and Android.
Users can opt-in from settings screen.

Closes #123
```

### Commit message rules

- ✅ Use imperative mood ("add" not "added" or "adds")
- ✅ First line max 72 characters
- ✅ Body wraps at 72 characters
- ✅ Reference issues/PRs in footer
- ❌ Don't capitalize first letter
- ❌ Don't end subject with period

## Common Workflows

### Starting new feature

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/property-filters

# 3. Make changes and commit
git add .
git commit -m "feat(properties): add status filter dropdown"

# 4. Push to remote
git push -u origin feature/property-filters

# 5. Create Pull Request on GitHub
```

### Keeping branch up to date

```bash
# Rebase on main (preferred for cleaner history)
git checkout feature/my-feature
git fetch origin
git rebase origin/main

# Or merge (if rebase is too complex)
git merge origin/main

# Push (force push needed after rebase)
git push --force-with-lease
```

### Fixing commits

```bash
# Amend last commit (if not pushed yet)
git add .
git commit --amend

# Interactive rebase to fix multiple commits
git rebase -i HEAD~3  # Last 3 commits

# Squash commits
# In interactive rebase, mark commits as 'squash' or 's'
pick abc1234 feat(auth): add login screen
squash def5678 fix typo
squash ghi9012 fix linting

# Results in single commit
```

### Undoing changes

```bash
# Unstage files
git reset HEAD <file>

# Discard local changes
git checkout -- <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert <commit-hash>
```

## Pull Request Guidelines

### PR title format

Follow commit message convention:

```
feat(properties): Add advanced search filters
fix(navigation): Resolve back button crash on Android
docs: Update API documentation
```

### PR description template

```markdown
## Description

Brief description of changes and why they're needed.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Changes Made

- Added property search filters
- Implemented filter state management
- Updated UI components for filter display

## Testing Done

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web

## Screenshots (if applicable)

[Add screenshots or screen recordings]

## Related Issues

Closes #123
Related to #456

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Branch is up to date with main
```

### PR review checklist

**For Reviewers:**

- [ ] Code follows project patterns and conventions
- [ ] Business logic is in services, not UI components
- [ ] Error handling is proper (ServiceError with context)
- [ ] Input validation exists
- [ ] TypeScript types are properly defined
- [ ] No hard-coded values (uses theme tokens/constants)
- [ ] Navigation uses Expo Router APIs
- [ ] Components are accessible (accessibilityLabel, role)
- [ ] Tests cover new functionality
- [ ] No console.log left in code
- [ ] Performance considerations addressed
- [ ] Security implications considered
- [ ] Documentation updated if needed

**For Authors:**

- [ ] Self-reviewed the diff
- [ ] Tests added and passing
- [ ] No merge conflicts
- [ ] Branch is up to date with main
- [ ] All CI checks passing
- [ ] Breaking changes documented
- [ ] Migration guide provided (if breaking changes)

## Merge Strategies

### Squash and merge (recommended for features)

```bash
# On GitHub: "Squash and merge"
# Results in single commit on main
# Clean history, easier to revert features
```

### Rebase and merge (for well-structured commits)

```bash
# On GitHub: "Rebase and merge"
# Preserves individual commits
# Use when commits are well-crafted and logical
```

### Merge commit (avoid unless necessary)

```bash
# On GitHub: "Create a merge commit"
# Creates merge commit
# Clutters history, harder to navigate
```

## Hotfix Workflow

For urgent production fixes:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. Make fix and commit
git add .
git commit -m "fix(auth): patch XSS vulnerability"

# 3. Push and create PR
git push -u origin hotfix/security-patch

# 4. Get expedited review and merge
# 5. Tag release
git tag -a v1.2.1 -m "Hotfix: Security patch"
git push origin v1.2.1

# 6. If using develop branch, merge back
git checkout develop
git merge main
```

## Conflict Resolution

```bash
# When conflicts occur during rebase/merge
git status  # See conflicted files

# 1. Open files and resolve conflicts
# Look for <<<<<<, ======, >>>>>> markers

# 2. Stage resolved files
git add <resolved-file>

# 3. Continue rebase
git rebase --continue

# Or abort if needed
git rebase --abort
```

## Git Best Practices

### ✅ Do this

```bash
# Commit often with logical units
git commit -m "feat(auth): add login form validation"
git commit -m "feat(auth): add biometric support"

# Write descriptive commit messages
git commit -m "fix(sessions): prevent timer from continuing after pause"

# Keep commits focused
# One feature/fix per commit

# Pull before pushing
git pull --rebase origin main
git push

# Use .gitignore
# Ensure node_modules, .env, build artifacts ignored
```

### ❌ Avoid this

```bash
# Vague commit messages
git commit -m "fix stuff"
git commit -m "wip"
git commit -m "changes"

# Committing too much at once
# 50 files changed, 2000 lines modified

# Committing sensitive data
git commit -m "add API keys"  # NEVER!

# Not pulling before pushing
# Creates unnecessary merge commits
```

## Advanced Git Tips

### Stash changes

```bash
# Save work in progress
git stash save "WIP: working on filters"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Clear all stashes
git stash clear
```

### Cherry-pick commits

```bash
# Apply specific commit from another branch
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit1> <commit2>
```

### Search history

```bash
# Search commits by message
git log --grep="authentication"

# Search commits by author
git log --author="John Doe"

# Search code changes
git log -S "propertyService"

# View file history
git log --follow <file>
```

## CI/CD Integration

### GitHub Actions workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test
```

### Pre-commit hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Versioning

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

1.0.0 - Initial release
1.1.0 - New feature (backwards compatible)
1.1.1 - Bug fix (backwards compatible)
2.0.0 - Breaking change
```

### Tagging releases

```bash
# Create annotated tag
git tag -a v1.2.0 -m "Release version 1.2.0"

# Push tag to remote
git push origin v1.2.0

# List tags
git tag -l

# Delete tag
git tag -d v1.2.0
git push origin --delete v1.2.0
```
