# 🔀 GitHub Workflow Guide

> Git operations and commit standards for non-technical users

## 📋 Table of Contents
- [Branching Strategy](#branching-strategy)
- [Basic Git Commands](#basic-git-commands)
- [Commit Message Standards](#commit-message-standards)
- [Pre-Push Checklist](#pre-push-checklist)
- [Common Git Issues](#common-git-issues)

---

## 🌳 Branching Strategy

**We use GitHub Flow** - a simple, branch-based workflow:

### Quick Reference
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Make changes, then push
git add .
git commit -m "feat: Description"
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# After merge, clean up:
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

### Branch Types
- **`main`** - Production code (always deployable)
- **`feature/*`** - New features (e.g., `feature/photo-proof`)
- **`bugfix/*`** - Bug fixes (e.g., `bugfix/auth-error`)
- **`hotfix/*`** - Emergency fixes (e.g., `hotfix/critical-crash`)

📖 **Full documentation**: [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)  
📋 **Quick reference**: [BRANCHING_QUICK_REFERENCE.md](../reference/BRANCHING_QUICK_REFERENCE.md)

---

## 💻 Basic Git Commands

### Everyday Git Commands

#### Check What Changed
```bash
# See which files you modified
git status

# See what actually changed in files
git --no-pager diff

# See recent commits
git --no-pager log --oneline -10
```

---

#### Save Your Changes
```bash
# Step 1: Stage all changes
git add .

# Step 2: Commit with message
git commit -m "Brief description of what you did"

# Step 3: Push to GitHub
git push origin main
```

---

#### Get Latest Changes
```bash
# Pull latest changes
git pull origin main
```

---

## 📝 Commit Message Standards

### Standard Format
```
[TYPE]: Brief description (affects: user_role)

- Specific change 1
- Specific change 2
- Business impact/value

Docs updated: file1.md, file2.md
```

### Commit Types

| Type | When to Use | Example |
|------|-------------|---------|
| **FEATURE** | New functionality added | Added photo proof for cleanings |
| **FIX** | Bug fixed | Fixed linen calculation error |
| **REFACTOR** | Code improved (no new features) | Simplified property service |
| **DOCS** | Documentation only | Updated README setup steps |
| **PERF** | Performance improvement | Optimized property list loading |

---

### Good Commit Examples

#### Feature Commit
```bash
git commit -m "FEATURE: Add real-time cleaning notifications (affects: property_owner, cleaner)

- Implemented Supabase real-time subscriptions for cleaning_sessions table
- Added notification badge component with unread count
- Created notification service with push notification support
- Business impact: Reduces communication delays by 90%

Docs updated: CHANGELOG.md, docs/manifests/COMPONENTS.md, docs/manifests/SERVICES.md"
```

#### Bug Fix Commit
```bash
git commit -m "FIX: Resolve linen calculation for properties >6 guests (affects: cleaner)

- Fixed multiplier logic in calculateLinenRequirements function
- Added boundary condition handling for large groups
- Updated CleanerPropertyCard to display correct quantities
- Business impact: Prevents cleaner preparation errors

Docs updated: CHANGELOG.md"
```

---

## ✅ Pre-Push Checklist

**Complete BEFORE every `git push`:**

### Phase 1: Code Verification
```bash
# 1. Type check (must pass with no errors)
npm run lint

# 2. Start app and test
npm start
# Test key features work correctly

# 3. Check for leftover debug code
# Remove any console.log statements
```

- [ ] TypeScript compiles with no errors
- [ ] App runs without crashing
- [ ] Key features tested and work
- [ ] No console.log statements left in code

---

### Phase 2: Documentation Updates

**For New Features:**
- [ ] `CHANGELOG.md` - Add feature details
- [ ] Relevant manifest file (if new component/service/screen)

**For Bug Fixes:**
- [ ] `CHANGELOG.md` - Document fix

---

### Phase 3: Git Workflow
```bash
# 1. Check what changed
git status

# 2. Review your changes
git --no-pager diff

# 3. Stage all changes
git add .

# 4. Commit with proper message
git commit -m "[TYPE]: Description (affects: roles)

- Change 1
- Change 2
- Impact

Docs updated: files.md"

# 5. Push to GitHub
git push origin main
```

---

## 🚨 Common Git Issues

### Issue 1: "Your branch is behind 'origin/main'"

**Problem**: Someone else pushed changes to GitHub

**Solution**:
```bash
# Save your local changes first
git stash

# Get latest changes
git pull origin main

# Restore your changes
git stash pop

# If conflicts, resolve them and commit
```

---

### Issue 2: "Merge Conflict"

**Problem**: You and someone else changed the same lines

**Solution**:
```bash
# Git will mark conflicts in files like this:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# 1. Open the file
# 2. Choose which version to keep (or combine both)
# 3. Remove the conflict markers (<<<, ===, >>>)
# 4. Save the file
# 5. Stage and commit

git add .
git commit -m "Resolved merge conflict in [filename]"
```

---

### Issue 3: "Accidentally committed wrong files"

**Solution** (Before push):
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Unstage specific file
git reset HEAD unwanted-file.txt

# Stage only the files you want
git add correct-file.txt

# Commit again
git commit -m "Correct commit message"
```

---

### Issue 4: ".gitignore not working"

**Solution**:
```bash
# Remove from Git tracking (but keep file locally)
git rm --cached filename

# Commit the removal
git add .
git commit -m "Remove tracked files that should be ignored"
```

---

## 🎯 Git Workflow Summary

**Daily Workflow**:
```bash
# Morning: Get latest
git pull origin main

# Work: Make changes
# ... edit files ...

# End of day: Save changes
git add .
git commit -m "FEATURE: Complete description"
git push origin main
```

---

**Remember**: Commit early and often. Git is your safety net!

