# Branching Quick Reference

## 🚀 Quick Start

### Start New Feature
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Make Changes & Push
```bash
git add .
git commit -m "feat: Description of changes"
git push origin feature/your-feature-name
```

### Create Pull Request
1. Go to GitHub → New Pull Request
2. Select: `feature/your-feature-name` → `main`
3. Fill description, request review
4. Wait for approval, then merge

### Clean Up After Merge
```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

## 📋 Branch Types

| Type | Naming | Purpose | Lifetime |
|------|--------|---------|----------|
| `main` | `main` | Production code | Permanent |
| `feature/*` | `feature/description` | New features | Days to weeks |
| `bugfix/*` | `bugfix/description` | Bug fixes | Days to weeks |
| `hotfix/*` | `hotfix/description` | Emergency fixes | Hours to days |

## 📝 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### Examples
```
feat(cleaner): Add photo proof validation
fix(auth): Resolve login crash
docs(readme): Update setup instructions
```

## 🔄 Common Workflows

### Sync Feature Branch with Main
```bash
git checkout feature/your-feature
git merge main
# Resolve conflicts if any
git push origin feature/your-feature
```

### Emergency Hotfix
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue
# Make fix
git add .
git commit -m "fix: Critical issue description"
git push origin hotfix/critical-issue
# Create PR, merge immediately
```

### Delete Old Branch
```bash
# Local
git branch -d branch-name

# Remote
git push origin --delete branch-name
```

## 🎯 Branch Naming Examples

### Good ✅
```
feature/photo-proof-validation
feature/cleaner-dashboard
bugfix/auth-token-expiry
hotfix/payment-gateway-error
```

### Bad ❌
```
feature
fix
update
test
branch1
```

## ⚠️ Important Rules

### DO ✅
- Pull latest main before creating branch
- Use descriptive branch names
- Write clear commit messages
- Delete branches after merge
- Test before pushing
- Keep branches short-lived

### DON'T ❌
- Commit directly to main
- Use generic branch names
- Force push to shared branches
- Leave branches for months
- Skip code review
- Commit secrets

## 🔍 Useful Commands

```bash
# View all branches
git branch -a

# View branch history
git log --oneline --graph --all --decorate

# Check which branch you're on
git branch

# View uncommitted changes
git status

# View commit history
git log --oneline -10
```

## 🆘 Troubleshooting

### Branch behind main
```bash
git checkout your-branch
git merge main
# Fix conflicts
git push origin your-branch
```

### Accidentally on main
```bash
git branch feature/your-feature
git checkout main
git reset --hard origin/main
git checkout feature/your-feature
```

### Need to rename branch
```bash
git branch -m old-name new-name
git push origin --delete old-name
git push origin new-name
git push origin -u new-name
```

## 📊 Branch Lifecycle

```
1. Create from main
   ↓
2. Make changes & commit
   ↓
3. Push to GitHub
   ↓
4. Create Pull Request
   ↓
5. Code review
   ↓
6. Merge to main
   ↓
7. Delete branch
```

## 🔗 Linking to Issues

In PR description or commit message:
- `Closes #123` - Closes issue
- `Fixes #123` - Fixes issue
- `Resolves #123` - Resolves issue
- `Related to #123` - Links issue

## 📖 Full Documentation

For complete details, see: [BRANCHING_STRATEGY.md](../workflows/BRANCHING_STRATEGY.md)

