# ⚠️ DOCUMENTATION MOVED

This file has been relocated as part of the documentation restructure.

## New Location
→ **[docs/08-ai-context/ai-README.md](./08-ai-context/ai-README.md)**

## Quick Navigation
- **AI Entry Point**: [docs/08-ai-context/ai-README.md](./08-ai-context/ai-README.md) (30-second overview)
- **Startup Checklist**: [docs/08-ai-context/startup-checklist.md](./08-ai-context/startup-checklist.md)
- **Phase Status**: [docs/07-project-management/phase-status.md](./07-project-management/phase-status.md)
- **Manifests**: [docs/04-codebase/](./04-codebase/)

## Documentation Structure
The documentation has been reorganized following arc42 and C4 Model principles:

```
docs/
├── 01-introduction/          # Overview, getting started, quality standards
├── 02-architecture/          # arc42 sections, C4 diagrams
├── 03-development/          # Setup, workflows, commands, troubleshooting
├── 04-codebase/            # Manifests (components, services, screens, types)
├── 05-features/            # Feature specifications
├── 06-patterns/            # Reusable code patterns
├── 07-project-management/  # Phase tracking, roadmap, changelog
└── 08-ai-context/          # AI-specific guidance (YOU ARE HERE)
```

## Main Entry Point
→ **[docs/README.md](./README.md)** - Complete documentation hub

---

**Redirecting to**: [docs/08-ai-context/ai-README.md](./08-ai-context/ai-README.md)

## 🗂️ Project Structure
```
/app/           → 13 screens (Expo Router)
/components/    → 18 reusable UI components
/services/      → 8 business logic services
/types/         → All TypeScript definitions
/docs/          → This documentation system
```

## ✅ Quality Checklist (Before Completing Tasks)
Every feature must have:
- [ ] TypeScript (no 'any' types)
- [ ] Loading state (spinner during async)
- [ ] Error state (user-friendly message)
- [ ] Empty state (when no data)
- [ ] Try/catch on all service calls
- [ ] Business rules enforced
- [ ] Mobile responsive
- [ ] Follows existing patterns
- [ ] No TODOs or console.logs

## 🚫 Never Do This
- ❌ Use 'any' type
- ❌ Call Supabase directly from components (use services)
- ❌ Skip error handling
- ❌ Create incomplete features
- ❌ Ignore business rules (cleaning window, financial privacy, etc.)
- ❌ Deviate from specs without explaining why

## 📖 How to Use Documentation

### Starting New Feature
1. Check `docs/phase-tracking/PHASE_STATUS.md` for current priority
2. Read feature spec in `docs/features/[feature-name].md`
3. Review similar component in `docs/manifests/COMPONENTS.md`
4. Follow pattern from existing code
5. Test thoroughly before marking complete

### Fixing Bug
1. Read `docs/reference/TROUBLESHOOTING.md` for common issues
2. Check if pattern exists in `docs/reference/API_PATTERNS.md`
3. Follow existing error handling patterns
4. Test fix doesn't break related features

### Adding to Existing Feature
1. Find feature spec in `docs/features/`
2. Check which components/services already exist
3. Extend using same patterns
4. Update feature spec with new functionality

## 💬 Communication Format

When you complete work, tell me:
1. **What was built**: "Created X so Y can Z"
2. **Files changed**: List paths of new/modified files
3. **Business rules applied**: Which of 5 critical rules enforced
4. **Testing steps**: How to verify it works
5. **Next recommendation**: What should be built next and why

## 🎓 Understanding the Codebase

**To see all components:**
→ `docs/manifests/COMPONENTS.md`

**To see all services:**
→ `docs/manifests/SERVICES.md`

**To understand business rules:**
→ `docs/core/BUSINESS_RULES.md`

**To see what exists:**
→ Browse `/components/`, `/services/`, `/app/` folders

**To know what's next:**
→ `docs/phase-tracking/PHASE_STATUS.md`

---

**Current Phase**: Phase 1 Complete (100%)
**Current Focus**: Planning Phase 2 features
**Questions?** Reference `.cursorrules` for all coding standards

