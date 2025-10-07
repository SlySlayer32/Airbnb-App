# 📦 Documentation Migration Guide

> Reference for finding documentation in the new `.ai/` system

## 🎯 Quick Summary

**Old System**: Documentation scattered across `.github/instructions/` (11 files), `docs/business/`, `docs/technical/`, `docs/process/`, and `docs/archive/`

**New System**: Consolidated into `.ai/` directory with 10 core files organized for AI consumption

## 📂 Where Things Moved

### From `.github/instructions/` → `.ai/`

| Old File | New Location | What Changed |
|----------|-------------|--------------|
| `copilot.instructions.md` | `.ai/README.md` | Consolidated into main README |
| `general-context.instructions.md` | `.ai/README.md` | Merged into project overview |
| `components.instructions.md` | `.ai/COMPONENT_MANIFEST.md` + `.ai/CONVENTIONS.md` | Split into manifest + patterns |
| `services.instructions.md` | `.ai/SERVICE_MANIFEST.md` + `.ai/CONVENTIONS.md` | Split into manifest + patterns |
| `screens.instructions.md` | `.ai/SCREEN_MANIFEST.md` | Expanded with detailed examples |
| `types.instructions.md` | `.ai/CONVENTIONS.md` | Merged into TypeScript standards |
| `debugging.instructions.md` | `.ai/TROUBLESHOOTING.md` | Expanded with more issues |
| `documentation.instructions.md` | `.ai/GITHUB_WORKFLOW.md` | Expanded with git guide |
| `feature-development.instructions.md` | `.ai/WORKFLOWS.md` | Expanded with complete workflows |
| `github-workflow.instructions.md` | `.ai/GITHUB_WORKFLOW.md` | Consolidated and simplified |

### From `docs/` Folders → Archived/Consolidated

| Old Location | Status | Notes |
|-------------|---------|-------|
| `docs/archive/*` | **Kept as-is** | Historical roadmaps and analysis |
| `docs/business/*` | **Kept for stakeholders** | Executive summaries, issue tracking |
| `docs/technical/*` | **Kept for onboarding** | Development history, handoff guides |
| `docs/process/CONTRIBUTING.md` | **Update to reference `.ai/`** | Point to new workflow docs |
| `docs/process/VERSION.md` | **Kept** | Version tracking |

## 🔍 How to Find Information Now

### "I need to understand the project"
→ Start with [`.ai/README.md`](.ai/README.md)

### "I need a quick command or pattern"
→ Check [`.ai/QUICK_REFERENCE.md`](.ai/QUICK_REFERENCE.md)

### "I want to know what components exist"
→ See [`.ai/COMPONENT_MANIFEST.md`](.ai/COMPONENT_MANIFEST.md)

### "I need to understand a service API"
→ See [`.ai/SERVICE_MANIFEST.md`](.ai/SERVICE_MANIFEST.md)

### "I want to know what screens we have"
→ See [`.ai/SCREEN_MANIFEST.md`](.ai/SCREEN_MANIFEST.md)

### "I need to follow code standards"
→ Check [`.ai/CONVENTIONS.md`](.ai/CONVENTIONS.md)

### "I'm starting a new feature"
→ Follow [`.ai/WORKFLOWS.md`](.ai/WORKFLOWS.md)

### "I don't know how to ask the AI"
→ Use templates in [`.ai/PROMPTING_GUIDE.md`](.ai/PROMPTING_GUIDE.md)

### "I need to use Git"
→ See [`.ai/GITHUB_WORKFLOW.md`](.ai/GITHUB_WORKFLOW.md)

### "Something is broken"
→ Check [`.ai/TROUBLESHOOTING.md`](.ai/TROUBLESHOOTING.md)

## 📋 What Stayed the Same

These files remain in their original locations:

### Root Level
- `README.md` - Updated with link to `.ai/README.md`
- `CHANGELOG.md` - Version history (keep updating)
- `package.json` - Dependencies
- `.gitignore` - Ignored files

### `.github/` Directory
- `.github/ISSUE_TEMPLATE/` - Issue templates
- `.github/pull_request_template.md` - PR template
- `.github/instructions/` - **Kept for GitHub Copilot compatibility**

### `docs/` Directory
- `docs/business/` - Executive summaries for stakeholders
- `docs/technical/` - Development history for onboarding
- `docs/archive/` - Historical roadmaps and analysis
- `docs/process/` - Contributing guidelines

## 🔄 Migration Benefits

### For AI Assistants
- ✅ Single entry point (`.ai/README.md`)
- ✅ Complete inventories (manifests)
- ✅ Clear hierarchy and navigation
- ✅ Optimized for quick lookup
- ✅ No duplicate information

### For Developers
- ✅ Faster onboarding (start in `.ai/`)
- ✅ Easy reference (manifests + quick ref)
- ✅ Clear workflows to follow
- ✅ Troubleshooting guide

### For Non-Technical Founders
- ✅ AI prompting templates
- ✅ Git guide for non-developers
- ✅ Business-focused README

## 🎯 Action Items

### If You're an AI Assistant
1. Read `.ai/README.md` first for complete context
2. Reference manifests when working with components/services/screens
3. Follow conventions in `.ai/CONVENTIONS.md`
4. Use workflows in `.ai/WORKFLOWS.md` for feature development

### If You're a Developer
1. Start onboarding with `.ai/README.md`
2. Bookmark `.ai/QUICK_REFERENCE.md`
3. Reference manifests when finding code
4. Follow `.ai/WORKFLOWS.md` for daily processes

### If You're the Founder (J)
1. Use `.ai/PROMPTING_GUIDE.md` for effective AI communication
2. Reference `.ai/README.md` when explaining the project
3. Use `.ai/GITHUB_WORKFLOW.md` for git operations
4. Keep `.ai/` docs updated as project evolves

## 📚 Documentation Maintenance

### When to Update `.ai/` Files

**After Adding Components**:
- Update `.ai/COMPONENT_MANIFEST.md`
- Update counts in `.ai/README.md`

**After Adding Services**:
- Update `.ai/SERVICE_MANIFEST.md`
- Update counts in `.ai/README.md`

**After Adding Screens**:
- Update `.ai/SCREEN_MANIFEST.md`
- Update counts in `.ai/README.md`

**After Changing Patterns**:
- Update `.ai/CONVENTIONS.md`
- Document in `CHANGELOG.md`

**After Finding New Issues**:
- Add to `.ai/TROUBLESHOOTING.md`

**Always**:
- Update `CHANGELOG.md` for all changes
- Update relevant manifest files

## 🔮 Future Enhancements

Potential automation scripts (future):
- `scripts/update-manifests.js` - Auto-generate manifests from codebase
- `scripts/check-docs-sync.js` - Verify manifests match code
- `scripts/validate-structure.js` - Ensure .ai/ structure is correct

## ✅ Migration Checklist

- [x] Created `.ai/` directory structure
- [x] Created 10 core documentation files
- [x] Updated `README.md` with link to `.ai/`
- [x] Created migration guide
- [ ] Update `docs/process/CONTRIBUTING.md` to reference `.ai/`
- [ ] Update `.github/instructions/copilot.instructions.md` to reference `.ai/`
- [ ] Test with AI assistant to verify clarity
- [ ] Add to `.ai/README.md` to onboarding process

---

**Migration Date**: January 2025  
**Maintained By**: Project owner (J) and AI assistants  
**Questions**: See [`.ai/TROUBLESHOOTING.md`](.ai/TROUBLESHOOTING.md)
