# 📚 Documentation Index

> Quick navigation for the complete documentation system

## 🚀 Start Here

**New to the project?** → Read `AI-README.md` first  
**Need something specific?** → Use the sections below  
**Building a feature?** → Check `phase-tracking/PHASE_STATUS.md` for current priority

---

## 📖 Documentation Structure

### 📚 AI-README.md
**Purpose**: AI's first-read entry point  
**Contains**: 30-second context overview, navigation guide  
**Read When**: Starting any new AI session

---

### 📂 core/ - Essential Project Context

| File | Purpose | Size |
|------|---------|------|
| **PRODUCT.md** | Business vision, user needs, market opportunity | Complete |
| **BUSINESS_RULES.md** | The 5 critical rules with code examples | Complete |
| **USER_ROLES.md** | Permission matrices for all 3 roles | Complete |
| **TECH_STACK.md** | Technology choices and architecture | Complete |

**Read When**: Need to understand project fundamentals

---

### 📊 phase-tracking/ - Live Development Status

| File | Purpose | Updates |
|------|---------|---------|
| **CURRENT_PHASE.json** | Machine-readable phase status | Auto-updated |
| **PHASE_STATUS.md** | Human-readable dashboard | Manual |
| **ISSUE_AUDIT.md** | Quality assessment of completed work | After issues |

**Subfolder: phases/**
- `PHASE_1_COMPLETE.md` - Detailed completion report
- `PHASE_2_PLANNED.md` - Next phase breakdown

**Read When**: Need to know current progress or next priority

---

### 📦 manifests/ - Code Inventory

| File | Purpose | Count |
|------|---------|-------|
| **COMPONENTS.md** | All UI components with props | 18 components |
| **SERVICES.md** | All business logic services | 8 services |
| **SCREENS.md** | All screens with routes | 13 screens |
| **TYPES.md** | TypeScript reference | 20+ interfaces |

**Read When**: Working with or searching for existing code

---

### 🎨 features/ - Feature Specifications

| File | Status | User Role |
|------|--------|-----------|
| **cleaner-dashboard.md** | ✅ Implemented | cleaner |
| **session-lifecycle.md** | ✅ Implemented | cleaner, owner |
| **photo-proof.md** | ✅ Implemented | cleaner, owner |
| **real-time-updates.md** | ✅ Implemented | all roles |
| **banner-state-machine.md** | ✅ Implemented | cleaner |

**Read When**: Implementing or modifying specific features

---

### 📚 reference/ - Quick Lookup

| File | Purpose |
|------|---------|
| **QUICK_REFERENCE.md** | Commands, imports, patterns, styling |
| **API_PATTERNS.md** | Service templates, code examples |
| **PROMPTING_GUIDE.md** | How to communicate with AI |
| **TROUBLESHOOTING.md** | Common errors and solutions |

**Read When**: Need fast lookup during development

---

### 🔄 workflows/ - Development Processes

| File | Purpose |
|------|---------|
| **FEATURE_DEVELOPMENT.md** | New feature process |
| **BUG_FIXING.md** | Debug and fix workflow |
| **GITHUB_WORKFLOW.md** | Git operations guide |
| **DEPLOYMENT.md** | Production deployment steps |

**Read When**: Starting tasks or need process guidance

---

### 🗄️ DATABASE.md
**Purpose**: Supabase schema reference  
**Contains**: All tables, fields, relationships, RLS policies  
**Read When**: Working with database or understanding data structure

---

## 🎯 Quick Lookup by Need

### "I need to understand the project"
1. Start: `AI-README.md` (30 seconds)
2. Then: `core/PRODUCT.md` (business context)
3. Then: `core/BUSINESS_RULES.md` (critical constraints)

### "I want to build a feature"
1. Check: `phase-tracking/PHASE_STATUS.md` (current priority)
2. Read: `workflows/FEATURE_DEVELOPMENT.md` (process)
3. Reference: `manifests/` (what exists)
4. Follow: `.cursorrules` (code standards)

### "I need to fix a bug"
1. Read: `reference/TROUBLESHOOTING.md` (common issues)
2. Follow: `workflows/BUG_FIXING.md` (debug process)
3. Check: `reference/API_PATTERNS.md` (correct patterns)

### "I want to know what exists"
1. Components: `manifests/COMPONENTS.md`
2. Services: `manifests/SERVICES.md`
3. Screens: `manifests/SCREENS.md`
4. Types: `manifests/TYPES.md`

### "I don't know how to ask the AI"
→ `reference/PROMPTING_GUIDE.md`

### "Something is broken"
→ `reference/TROUBLESHOOTING.md`

---

## 📊 Documentation Statistics

**Total Files**: 26 (+ 4 legacy in business/technical folders)  
**Total Folders**: 6 organized categories  
**Components Documented**: 18  
**Services Documented**: 8  
**Screens Documented**: 13  
**Feature Specs**: 5  
**Last Updated**: January 2025  

---

## 🛠️ Maintenance

### Automated Scripts
```bash
# Validate documentation structure
node scripts/validate-docs.js

# Generate manifest report
node scripts/generate-manifests.js

# Update phase status
node scripts/update-phase-status.js
```

### When to Update

**After Adding Component**:
- Update `manifests/COMPONENTS.md`
- Run `node scripts/generate-manifests.js` to verify count

**After Adding Service**:
- Update `manifests/SERVICES.md`
- Document methods with examples

**After Completing Issue**:
- Update `phase-tracking/ISSUE_AUDIT.md`
- Run `node scripts/update-phase-status.js`
- Update `phase-tracking/PHASE_STATUS.md`

**After New Feature**:
- Create spec in `features/[feature-name].md`
- Update relevant manifests
- Update `CHANGELOG.md`

---

## ✅ Success Criteria

This documentation system succeeds when:
1. ✅ AI assistants find all context in docs/ directory
2. ✅ New developers onboard in < 30 minutes
3. ✅ No need to search multiple files for information
4. ✅ Manifests provide complete inventories
5. ✅ Business rules are clear and enforceable
6. ✅ Development workflows are repeatable
7. ✅ Phase tracking shows live progress
8. ✅ Automation scripts keep docs current

---

**Remember**: Start with `AI-README.md`, then explore relevant folders based on your task.

**Maintained By**: Project owner and AI assistants  
**Questions?**: See `reference/TROUBLESHOOTING.md`

