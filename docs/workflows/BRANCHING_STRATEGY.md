# Branching Strategy

## Overview
This document outlines the branching strategy for the Airbnb Cleaning Management Platform. We follow **GitHub Flow** - a lightweight, branch-based workflow designed around regular deployments.

## Branch Types

### 1. `main` Branch
- **Purpose**: Production-ready code
- **Protection**: Always deployable
- **Rules**:
  - All commits must be tested and working
  - No direct commits (use Pull Requests)
  - All PRs require review before merge
  - Main branch is always deployable to production

### 2. `develop` Branch (Optional)
- **Purpose**: Integration branch for features
- **Use Case**: When multiple features need coordination
- **Rules**:
  - Created from `main`
  - Merged back to `main` when ready for release
  - Can be deleted after merge if no longer needed

### 3. `feature/*` Branches
- **Purpose**: Individual features or enhancements
- **Naming**: `feature/description-of-feature`
- **Examples**:
  - `feature/photo-proof-validation`
  - `feature/real-time-notifications`
  - `feature/invoice-generation`
- **Rules**:
  - Created from `main` (or `develop` if using it)
  - Short-lived (days to weeks, not months)
  - Deleted after merge
  - One feature per branch

### 4. `hotfix/*` Branches
- **Purpose**: Emergency fixes for production
- **Naming**: `hotfix/description-of-fix`
- **Examples**:
  - `hotfix/auth-crash`
  - `hotfix/payment-gateway-error`
- **Rules**:
  - Created from `main`
  - Merged to `main` immediately
  - Also merged to `develop` if it exists
  - Deleted after merge

### 5. `bugfix/*` Branches
- **Purpose**: Non-urgent bug fixes
- **Naming**: `bugfix/description-of-bug`
- **Examples**:
  - `bugfix/typo-in-error-message`
  - `bugfix/ui-alignment-issue`
- **Rules**:
  - Created from `main`
  - Follows same process as feature branches
  - Deleted after merge

## Workflow

### Starting a New Feature

1. **Update your local main branch:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a new feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your feature branch → main
   - Fill in PR description
   - Request review

### Merging a Feature

1. **Ensure your branch is up to date:**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature-name
   git merge main
   ```

2. **Resolve any conflicts**

3. **Push updates:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Merge PR on GitHub:**
   - Wait for code review approval
   - Ensure all checks pass
   - Click "Merge Pull Request"
   - Delete branch after merge

5. **Clean up locally:**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name
   ```

### Hotfix Workflow

1. **Create hotfix branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue
   ```

2. **Make the fix and commit:**
   ```bash
   git add .
   git commit -m "fix: Critical issue description"
   ```

3. **Push and create PR:**
   ```bash
   git push origin hotfix/critical-issue
   ```

4. **Merge immediately after review**

5. **Clean up:**
   ```bash
   git checkout main
   git pull origin main
   git branch -d hotfix/critical-issue
   ```

## Commit Message Convention

We follow **Conventional Commits** for consistency:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```
feat(cleaner): Add photo proof validation
fix(auth): Resolve login crash on iOS
docs(readme): Update installation instructions
refactor(services): Simplify session service
```

## Branch Naming Conventions

### Feature Branches
```
feature/description-with-dashes
feature/cleaner-dashboard
feature/photo-proof-gate
```

### Bugfix Branches
```
bugfix/description-with-dashes
bugfix/auth-token-expiry
bugfix/ui-alignment
```

### Hotfix Branches
```
hotfix/description-with-dashes
hotfix/critical-payment-error
hotfix/auth-crash
```

### Release Branches (if needed)
```
release/v1.0.0
release/v1.1.0
```

## Branch Protection Rules

### Main Branch Protection
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

## Best Practices

### Do's ✅
- Keep branches short-lived (merge within days/weeks)
- Use descriptive branch names
- Write clear commit messages
- Keep commits focused and atomic
- Test before pushing
- Update documentation with features
- Delete branches after merge

### Don'ts ❌
- Don't commit directly to main
- Don't use generic branch names like "fix" or "update"
- Don't let branches live for months
- Don't merge without review
- Don't force push to shared branches
- Don't commit secrets or credentials
- Don't skip tests

## Common Commands

### View all branches
```bash
git branch -a
```

### Delete local branch
```bash
git branch -d branch-name
```

### Delete remote branch
```bash
git push origin --delete branch-name
```

### Update main and create feature branch
```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
```

### Sync feature branch with main
```bash
git checkout feature/your-feature
git merge main
```

### View branch history
```bash
git log --oneline --graph --all --decorate
```

## Troubleshooting

### Branch is behind main
```bash
git checkout your-branch
git merge main
# Resolve conflicts
git push origin your-branch
```

### Accidentally committed to main
```bash
# Create new branch with your changes
git branch feature/your-feature
# Reset main to remote
git checkout main
git reset --hard origin/main
# Continue on feature branch
git checkout feature/your-feature
```

### Need to rename a branch
```bash
# Rename local branch
git branch -m old-name new-name
# Delete old remote branch
git push origin --delete old-name
# Push new branch
git push origin new-name
# Set upstream
git push origin -u new-name
```

## Integration with GitHub Issues

- Link PRs to issues using keywords:
  - `Closes #123` - Closes the issue
  - `Fixes #123` - Fixes the issue
  - `Resolves #123` - Resolves the issue
  - `Related to #123` - Links without closing

Example PR description:
```
Closes #45

## Changes
- Added photo proof validation
- Updated cleaner dashboard UI
- Fixed session state bug

## Testing
- [x] Tested on iOS
- [x] Tested on Android
- [x] Manual QA completed
```

## Review Checklist

Before requesting review, ensure:
- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] No hardcoded values
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] TypeScript types are correct
- [ ] No 'any' types used
- [ ] Business rules are enforced
- [ ] Mobile responsive
- [ ] Accessibility considered

## Summary

This branching strategy provides:
- ✅ Clear structure for all development work
- ✅ Easy collaboration between team members
- ✅ Safe deployment process
- ✅ Simple to understand and follow
- ✅ Scales with team growth
- ✅ Integrates with GitHub features

For questions or suggestions, please open an issue or discuss in team meetings.

