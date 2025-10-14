# AI Startup Checklist

> Mandatory reads before starting any work

## Before Every Session

### 1. Read Project Overview (30 seconds)
- **File**: `docs/08-ai-context/ai-README.md`
- **Why**: Understand project context and tech stack
- **Time**: 30 seconds

### 2. Check Current Phase (10 seconds)
- **File**: `docs/07-project-management/phase-status.md`
- **Why**: Know what's the current priority
- **Time**: 10 seconds

### 3. Review Business Rules (20 seconds)
- **File**: `docs/02-architecture/01-requirements.md`
- **Why**: Ensure you enforce all 5 critical rules
- **Time**: 20 seconds

### 4. Check Relevant Documentation (30 seconds)
- **Feature development**: `docs/03-development/workflows.md`
- **Bug fixing**: `docs/03-development/workflows.md`
- **Patterns**: `docs/06-patterns/`
- **Why**: Follow established patterns
- **Time**: 30 seconds

**Total Time**: ~90 seconds
**Time Saved**: Hours of rework

## When Building New Feature

1. ✅ Check `docs/07-project-management/phase-status.md` - Is this the priority?
2. ✅ Read feature spec in `docs/05-features/[feature-name].md` - Exact requirements
3. ✅ Check `docs/04-codebase/COMPONENTS.md` - What exists already?
4. ✅ Check `docs/04-codebase/SERVICES.md` - Can I reuse existing services?
5. ✅ Review `docs/02-architecture/01-requirements.md` - Which rules apply?
6. ✅ Follow pattern from `docs/06-patterns/`

## When Fixing Bug

1. ✅ Read `docs/03-development/troubleshooting.md` - Is this a known issue?
2. ✅ Check `docs/06-patterns/` - What's the correct pattern?
3. ✅ Review related feature spec in `docs/05-features/`
4. ✅ Verify fix doesn't break business rules

## When Extending Existing Feature

1. ✅ Find feature spec in `docs/05-features/[feature-name].md`
2. ✅ Check which components/services already exist in manifests
3. ✅ Use same patterns as existing implementation
4. ✅ Consider if feature spec needs updating

## When Asked "What Should I Build Next?"

1. ✅ Read `docs/07-project-management/phase-status.md` - Current priority
2. ✅ Check `docs/07-project-management/roadmap.md` - Future plans
3. ✅ Review `docs/02-architecture/01-requirements.md` - Product vision

## Documentation = Source of Truth

**If docs say X and user says Y**:
1. Flag the discrepancy: "The docs show X, but you mentioned Y"
2. Ask which is correct
3. Suggest updating docs after clarification

---

**Last Updated**: January 2025

