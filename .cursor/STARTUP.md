# 🚨 MANDATORY STARTUP SEQUENCE
## Execute BEFORE responding to ANY request

**⚠️ IMPORTANT**: This file is part of the startup sequence. For complete guidance, see:
→ **`CURSOR_ROADMAP.md`** - Single source of truth for all AI behavior

This file ensures AI follows proper workflow from the very first message.

---

## STEP 1: Read Essential Documentation (ALWAYS)
**Execute these reads at conversation start:**

```
1. READ: CURSOR_ROADMAP.md (complete AI guidance - 10-15 minutes)
2. READ: docs/08-ai-context/ai-README.md (30-second overview)
3. READ: docs/07-project-management/phase-status.md (current priority)
4. SCAN: docs/04-codebase/ (know what exists)
```

**Why:** Without this, you'll:
- ❌ Suggest features that already exist
- ❌ Ignore current phase priorities
- ❌ Violate established patterns
- ❌ Break business rules
- ❌ Miss vague input clarification opportunities
- ❌ Reference copyrighted documentation

---

## STEP 2: Identify Task Type
Based on user's request, determine:

### **A) New Feature Request**
- Read relevant feature spec in `docs/05-features/`
- Check `docs/04-codebase/components.md` for existing components
- Check `docs/04-codebase/services.md` for existing services
- Review `docs/02-architecture/01-requirements.md` for applicable rules
- Follow patterns from `docs/06-patterns/service-patterns.md`

### **B) Bug Fix**
- Read `docs/03-development/troubleshooting.md` first
- Check if issue is documented
- Review relevant feature spec
- Verify fix doesn't break business rules

### **C) General Question**
- Read `docs/08-ai-context/prompting-guide.md`
- Provide context-aware answer
- Suggest related documentation

### **D) "What should I build next?"**
- Read `docs/07-project-management/phase-status.md`
- Check `docs/07-project-management/roadmap.md`
- Suggest based on priority and dependencies

---

## STEP 3: Verify Understanding
Before writing ANY code, confirm:
- [ ] I've read the relevant documentation
- [ ] I understand current phase priority
- [ ] I know what components/services exist
- [ ] I know which business rules apply
- [ ] I'm following established patterns

---

## STEP 4: Execute Task
Follow workflow from `.cursorrules`:
1. Confirm what you're building
2. Check architecture/integrations
3. Provide complete code
4. Include testing steps
5. Suggest next logical step

---

## 🔴 CRITICAL: DON'T SKIP STEP 1
Even if the user's request seems simple, ALWAYS:
1. Read `docs/08-ai-context/ai-README.md` first
2. Check phase status
3. Then respond

**Time investment:** 30 seconds
**Benefit:** Avoid hours of rework from wrong assumptions

---

## 🧪 Self-Test Questions
Before responding to ANY user request, ask yourself:

1. "Have I read docs/08-ai-context/ai-README.md in THIS conversation?"
   - If NO → Read it now

2. "Do I know what phase we're in?"
   - If NO → Read docs/07-project-management/phase-status.md

3. "Do I know what components/services already exist?"
   - If NO → Scan docs/04-codebase/

4. "Am I about to suggest something that might already exist?"
   - If MAYBE → Check manifests first

5. "Does this involve cleaning sessions, pricing, or photos?"
   - If YES → Read docs/02-architecture/01-requirements.md

---

## 📋 Quick Reference Checklist

**Every new conversation:**
- [ ] Read docs/08-ai-context/ai-README.md
- [ ] Read docs/07-project-management/phase-status.md
- [ ] Know: 18 components exist
- [ ] Know: 8 services exist
- [ ] Know: 5 critical business rules

**Before suggesting features:**
- [ ] Check docs/04-codebase/components.md
- [ ] Check docs/04-codebase/services.md
- [ ] Read relevant feature spec

**Before fixing bugs:**
- [ ] Read docs/03-development/troubleshooting.md
- [ ] Check known issues

**Before answering questions:**
- [ ] Provide context from docs
- [ ] Cite specific documentation

---

## 💡 Why This Matters

**Without reading docs:**
- "Add a property card component" → Already exists (OwnerPropertyCard.tsx)
- "Create auth service" → Already exists (contexts/AuthContext.tsx)
- "Add photo upload" → Business rule requires min 3 photos
- "Schedule cleanings anytime" → Must be 11 AM - 3 PM

**With reading docs:**
- "Enhance OwnerPropertyCard to show [feature]"
- "Extend AuthContext to support [feature]"
- "Implement photo upload with 3-photo minimum enforcement"
- "Add scheduling UI with 11 AM - 3 PM constraint"

---

## 🎯 Success Criteria

You're following this properly when:
- ✅ First response references docs you read
- ✅ You mention current phase in context
- ✅ You cite existing components/services
- ✅ You follow established patterns
- ✅ You enforce business rules
- ✅ User doesn't say "that already exists"

---

## 🚨 Emergency Reset

If you realize mid-conversation you skipped Step 1:
1. STOP immediately
2. Say: "Let me check the documentation first"
3. Read docs/08-ai-context/ai-README.md
4. Read phase status
5. THEN continue

Better to pause and read than continue wrong.

---

**Last Updated:** January 2025
**Enforcement:** MANDATORY at every conversation start
**Penalty:** Rework, confusion, duplicate features

