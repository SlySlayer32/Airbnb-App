# 🚨 MANDATORY STARTUP SEQUENCE
## Execute BEFORE responding to ANY request

This file ensures AI follows proper workflow from the very first message.

---

## STEP 1: Read Project Context (ALWAYS)
**Execute these reads at conversation start:**

```
1. READ: docs/AI-README.md (30-second overview)
2. READ: docs/phase-tracking/PHASE_STATUS.md (current priority)
3. SCAN: docs/manifests/ (know what exists)
```

**Why:** Without this, you'll:
- ❌ Suggest features that already exist
- ❌ Ignore current phase priorities  
- ❌ Violate established patterns
- ❌ Break business rules

---

## STEP 2: Identify Task Type
Based on user's request, determine:

### **A) New Feature Request**
- Read relevant feature spec in `docs/features/`
- Check `docs/manifests/COMPONENTS.md` for existing components
- Check `docs/manifests/SERVICES.md` for existing services
- Review `docs/core/BUSINESS_RULES.md` for applicable rules
- Follow patterns from `docs/reference/API_PATTERNS.md`

### **B) Bug Fix**
- Read `docs/reference/TROUBLESHOOTING.md` first
- Check if issue is documented
- Review relevant feature spec
- Verify fix doesn't break business rules

### **C) General Question**
- Read `docs/reference/PROMPTING_GUIDE.md`
- Provide context-aware answer
- Suggest related documentation

### **D) "What should I build next?"**
- Read `docs/phase-tracking/PHASE_STATUS.md`
- Check `docs/phase-tracking/phases/PHASE_2_PLANNED.md`
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
1. Read `docs/AI-README.md` first
2. Check phase status
3. Then respond

**Time investment:** 30 seconds  
**Benefit:** Avoid hours of rework from wrong assumptions

---

## 🧪 Self-Test Questions
Before responding to ANY user request, ask yourself:

1. "Have I read docs/AI-README.md in THIS conversation?"
   - If NO → Read it now
   
2. "Do I know what phase we're in?"
   - If NO → Read docs/phase-tracking/PHASE_STATUS.md
   
3. "Do I know what components/services already exist?"
   - If NO → Scan docs/manifests/
   
4. "Am I about to suggest something that might already exist?"
   - If MAYBE → Check manifests first

5. "Does this involve cleaning sessions, pricing, or photos?"
   - If YES → Read docs/core/BUSINESS_RULES.md

---

## 📋 Quick Reference Checklist

**Every new conversation:**
- [ ] Read docs/AI-README.md
- [ ] Read docs/phase-tracking/PHASE_STATUS.md
- [ ] Know: 18 components exist
- [ ] Know: 8 services exist  
- [ ] Know: 5 critical business rules

**Before suggesting features:**
- [ ] Check docs/manifests/COMPONENTS.md
- [ ] Check docs/manifests/SERVICES.md
- [ ] Read relevant feature spec

**Before fixing bugs:**
- [ ] Read docs/reference/TROUBLESHOOTING.md
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
3. Read docs/AI-README.md
4. Read phase status
5. THEN continue

Better to pause and read than continue wrong.

---

**Last Updated:** October 10, 2025  
**Enforcement:** MANDATORY at every conversation start  
**Penalty:** Rework, confusion, duplicate features

