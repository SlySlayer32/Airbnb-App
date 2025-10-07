# 🔀 GitHub Workflow Guide

> Git operations, commit standards, and GitHub processes for non-technical users

## 📋 Table of Contents
- [Basic Git Commands](#basic-git-commands)
- [Commit Message Standards](#commit-message-standards)
- [Pre-Push Checklist](#pre-push-checklist)
- [Branch Management](#branch-management)
- [Pull Request Process](#pull-request-process)
- [Common Git Issues](#common-git-issues)

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
# Fetch latest from GitHub
git fetch

# Pull latest changes (must have clean working directory)
git pull origin main
```

---

### Understanding Git Status Messages

**"Changes not staged for commit"**
→ You edited files but haven't added them yet
→ Solution: `git add .`

**"Changes to be committed"**
→ Files are staged and ready to commit
→ Solution: `git commit -m "message"`

**"Your branch is ahead of 'origin/main'"**
→ You have local commits not pushed to GitHub
→ Solution: `git push origin main`

**"nothing to commit, working tree clean"**
→ Everything is saved and pushed
→ No action needed

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
| **SETUP** | Config/dependency changes | Updated Expo SDK to 54 |

---

### Good Commit Message Examples

#### Feature Commit
```bash
git commit -m "FEATURE: Add real-time cleaning notifications (affects: property_owner, cleaner)

- Implemented Supabase real-time subscriptions for cleaning_sessions table
- Added notification badge component with unread count
- Created notification service with push notification support
- Business impact: Reduces communication delays by 90%

Docs updated: CHANGELOG.md, COMPONENT_MANIFEST.md, SERVICE_MANIFEST.md"
```

---

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

#### Documentation Commit
```bash
git commit -m "DOCS: Update roadmap progress and testing results

- Marked notification system as 100% complete
- Updated workflow completion from 60% to 75%
- Added new integration opportunities analysis
- Refined success metrics based on testing feedback

Docs updated: .ai/README.md, CHANGELOG.md"
```

---

### Bad Commit Examples (Avoid These)

❌ **Too Vague**
```bash
git commit -m "fixes"
git commit -m "updates"
git commit -m "changes to property stuff"
```

❌ **No Context**
```bash
git commit -m "Updated CleanerPropertyCard.tsx"
# Why? What changed? What's the impact?
```

❌ **Multiple Unrelated Changes**
```bash
git commit -m "Added notifications, fixed bug in schedule, updated README"
# Should be 3 separate commits
```

---

## ✅ Pre-Push Checklist

**Complete BEFORE every `git push`:**

### Phase 1: Code Verification ⚙️
```bash
# 1. Type check (must pass with no errors)
npm run lint

# 2. Start app and test
npm start
# Test key features work correctly

# 3. Check for leftover debug code
grep -r "console.log" app/ components/ services/
# Remove any debug statements
```

- [ ] TypeScript compiles with no errors
- [ ] App runs without crashing
- [ ] Key features tested and work
- [ ] No console.log statements left in code
- [ ] Tested on device (not just simulator)

---

### Phase 2: Documentation Updates 📝

Update these based on what changed:

**For New Features:**
- [ ] `CHANGELOG.md` - Add feature details
- [ ] `.ai/COMPONENT_MANIFEST.md` (if new component)
- [ ] `.ai/SERVICE_MANIFEST.md` (if new service)
- [ ] `.ai/SCREEN_MANIFEST.md` (if new screen)

**For Bug Fixes:**
- [ ] `CHANGELOG.md` - Document fix
- [ ] `.ai/TROUBLESHOOTING.md` (if recurring issue)

**For Any Change:**
- [ ] Updated relevant `.ai/` files
- [ ] Commit message follows format

---

### Phase 3: Git Workflow 🔀
```bash
# 1. Check what changed
git status

# 2. Review your changes
git --no-pager diff

# 3. Stage all changes
git add .

# 4. Verify what's staged
git status

# 5. Commit with proper message
git commit -m "[TYPE]: Description (affects: roles)

- Change 1
- Change 2
- Impact

Docs updated: files.md"

# 6. Push to GitHub
git push origin main
```

---

### Phase 4: Verify Push ✓
```bash
# Confirm push was successful
git status
# Should say: "Your branch is up to date with 'origin/main'"

# View on GitHub
# Open: https://github.com/SlySlayer32/Airbnb-App
# Verify latest commit appears
```

---

## 🌿 Branch Management

### Main Branch (Default)
```bash
# Always work on main for simple changes
git checkout main
git pull origin main
# Make changes
git push origin main
```

---

### Feature Branches (For Large Features)
```bash
# Create new feature branch
git checkout -b feature/photo-proof-system

# Work on feature
# ... make changes, commit ...

# Push feature branch
git push origin feature/photo-proof-system

# Create pull request on GitHub
# After PR approved, merge to main
```

---

### When to Use Feature Branches

**Use Main Branch For:**
- Small bug fixes
- Documentation updates
- Minor tweaks
- Single-file changes

**Use Feature Branch For:**
- Large new features (5+ files)
- Breaking changes
- Experimental work
- Major refactors

---

## 📋 Pull Request Process

### Creating a Pull Request

1. **Push Feature Branch**
```bash
git push origin feature/branch-name
```

2. **Open GitHub**
- Go to https://github.com/SlySlayer32/Airbnb-App
- Click "Pull requests" → "New pull request"
- Select your feature branch

3. **Fill PR Template**
```markdown
## Summary
[Brief description of changes]

## Changes Made
- [Change 1]
- [Change 2]
- [Change 3]

## Business Impact
[How this benefits users]

## Testing Completed
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested all user roles
- [ ] No TypeScript errors

## Documentation Updated
- [ ] CHANGELOG.md
- [ ] Relevant .ai/ files
- [ ] README.md (if needed)

## Screenshots (if UI change)
[Add screenshots here]
```

4. **Request Review** (if working with team)

5. **Merge After Approval**
- Click "Merge pull request"
- Delete feature branch after merge

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

### Issue 3: "Need to pull but have uncommitted changes"

**Problem**: Can't pull because you have unsaved work

**Solution Option 1** (Save changes):
```bash
git stash
git pull origin main
git stash pop
```

**Solution Option 2** (Commit changes):
```bash
git add .
git commit -m "WIP: Work in progress"
git pull origin main
```

---

### Issue 4: "Accidentally committed wrong files"

**Problem**: Committed files you didn't mean to

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

### Issue 5: "Pushed wrong commit to GitHub"

**Problem**: Already pushed, need to undo

**Solution** (Creates new commit):
```bash
# Revert the commit (safe, doesn't rewrite history)
git revert <commit-hash>

# Push the revert
git push origin main
```

**Find commit hash**:
```bash
git log --oneline -10
# Copy the hash of the commit to revert
```

---

### Issue 6: "Want to undo all local changes"

**Problem**: Made a mess, want to start over

**Solution** (DANGER: Loses all changes):
```bash
# Discard ALL local changes
git reset --hard HEAD

# Get latest from GitHub
git pull origin main
```

---

### Issue 7: ".gitignore not working"

**Problem**: Files in .gitignore still tracked by Git

**Solution**:
```bash
# Remove from Git tracking (but keep file locally)
git rm --cached filename

# Or remove entire directory
git rm -r --cached directory/

# Commit the removal
git add .
git commit -m "Remove tracked files that should be ignored"
```

---

## 📦 What to Commit vs Ignore

### ✅ Always Commit
- Source code (`.ts`, `.tsx`, `.js`)
- Configuration files (`tsconfig.json`, `app.json`)
- Documentation (`.md` files)
- Package manifest (`package.json`)

### ❌ Never Commit
- Dependencies (`node_modules/`)
- Environment variables (`.env`, `.env.local`)
- Build output (`dist/`, `build/`, `.expo/`)
- IDE settings (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files (`*.log`)

### Already in `.gitignore`
Check `.gitignore` file in root directory for complete list.

---

## 🎯 Git Workflow Summary

**Daily Workflow**:
```bash
# Morning: Get latest
git pull origin main

# Work: Make changes
# ... edit files ...

# Before lunch: Save progress
git add .
git commit -m "WIP: Feature progress"
git push origin main

# End of day: Complete feature
git add .
git commit -m "FEATURE: Complete description"
git push origin main
```

**Feature Workflow**:
```bash
# Start feature
git checkout -b feature/name
# ... work on feature ...
git add .
git commit -m "FEATURE: Description"
git push origin feature/name
# Create PR on GitHub
# Merge PR
git checkout main
git pull origin main
```

---

## ✅ Success Checklist

You're using Git correctly when:
- [ ] Every commit has a clear, descriptive message
- [ ] Commits are focused (one logical change)
- [ ] You pull before starting work
- [ ] You push at the end of each work session
- [ ] No generated files in commits
- [ ] Documentation updated with code changes

---

**Remember**: Git is your safety net. Commit early and often!

---

**Last Updated**: January 2025  
**For Help**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
