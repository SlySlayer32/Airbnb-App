# Test: Verify AI Follows Startup Sequence

## Purpose
Use this to test if the AI properly reads documentation at the start of new conversations.

---

## Test 1: Documentation Awareness Test

### Start a NEW conversation and ask:
```
"What components exist in this project?"
```

### ✅ CORRECT Response Should:
1. Mention it read `docs/manifests/COMPONENTS.md`
2. List the 18 components that exist
3. Reference specific file paths
4. Mention it's from the manifest

### ❌ WRONG Response Would:
- Say "I don't know"
- Not mention reading documentation
- List components without file paths
- Guess instead of reading manifests

---

## Test 2: Phase Awareness Test

### Start a NEW conversation and ask:
```
"What should I work on next?"
```

### ✅ CORRECT Response Should:
1. Mention reading `docs/phase-tracking/PHASE_STATUS.md`
2. State "Phase 1 is complete (7/7 issues)"
3. Reference Phase 2 planning
4. Suggest based on documented priorities

### ❌ WRONG Response Would:
- Not mention phase status
- Suggest random features
- Not check phase documentation
- Answer without context

---

## Test 3: Business Rules Test

### Start a NEW conversation and ask:
```
"Can I schedule a cleaning for 6 PM?"
```

### ✅ CORRECT Response Should:
1. Immediately say "NO"
2. Reference the 11 AM - 3 PM cleaning window rule
3. Cite `docs/core/BUSINESS_RULES.md` or similar
4. Explain this is a NON-NEGOTIABLE constraint

### ❌ WRONG Response Would:
- Say "Yes" or "Maybe"
- Not mention the cleaning window rule
- Not reference documentation
- Allow violations of business rules

---

## Test 4: Existing Code Test

### Start a NEW conversation and ask:
```
"Create a component to display property cards for owners"
```

### ✅ CORRECT Response Should:
1. Say "That already exists: OwnerPropertyCard.tsx"
2. Reference `docs/manifests/COMPONENTS.md`
3. Offer to enhance the existing component instead
4. Show it checked for existing implementations

### ❌ WRONG Response Would:
- Start creating a new component from scratch
- Not check what already exists
- Create duplicate functionality
- Not mention the manifest

---

## Test 5: Context Integration Test

### Start a NEW conversation and ask:
```
"What tech stack is this project using?"
```

### ✅ CORRECT Response Should:
1. State: React Native + Expo SDK 54 + Supabase + TypeScript
2. Reference `.cursorrules` or `docs/core/TECH_STACK.md`
3. Mention specific constraints (no 'any' types, Ionicons only, etc.)
4. Show it read the project rules

### ❌ WRONG Response Would:
- Say "I don't know"
- Guess the tech stack
- Not mention reading documentation
- Provide generic React Native answer

---

## Test 6: Documentation-First Approach Test

### Start a NEW conversation and ask:
```
"Add photo upload for cleaning sessions"
```

### ✅ CORRECT Response Should:
1. Reference photo proof business rule (minimum 3 photos)
2. Check if PhotoProofGate component exists (it does)
3. Check if photoProofService exists (it does)
4. Suggest enhancing existing implementation
5. Mention the 11 AM-3 PM cleaning window constraint

### ❌ WRONG Response Would:
- Create photo upload without checking requirements
- Not mention minimum photo requirement
- Ignore existing components/services
- Skip business rule validation

---

## Test 7: New Feature Request Test

### Start a NEW conversation and ask:
```
"Build a notification system for cleaners"
```

### ✅ CORRECT Response Should:
1. Check if notifications table exists in database (it does)
2. Check if notificationService exists (it does)
3. Reference existing implementation
4. Ask what specific notification feature is needed
5. Suggest enhancing existing system

### ❌ WRONG Response Would:
- Start from scratch
- Not check database schema
- Not check existing services
- Create duplicate functionality

---

## Test 8: Vague Question Test

### Start a NEW conversation and ask:
```
"How do I test this app?"
```

### ✅ CORRECT Response Should:
1. Reference `SEED_DATA_SUMMARY.md`
2. Provide login credentials for test users
3. Mention 4 test users, 4 properties, 6 sessions
4. Direct to testing documentation
5. Reference the VSCode tasks for starting fresh

### ❌ WRONG Response Would:
- Give generic testing advice
- Not mention seed data
- Not mention test credentials
- Not reference documentation

---

## Test 9: Startup Declaration Test

### Start a NEW conversation and say:
```
"I need help with authentication"
```

### ✅ CORRECT Response Should START with something like:
- "Let me first read the project documentation..."
- "Checking docs/AI-README.md and phase status..."
- "I see from the manifests that AuthContext already exists..."
- Show evidence it read docs BEFORE answering

### ❌ WRONG Response Would:
- Jump straight into auth implementation
- Not mention reading any documentation
- No evidence of checking what exists
- Start suggesting code immediately

---

## Test 10: Comprehensive Integration Test

### Start a NEW conversation and ask:
```
"What's the current state of this project and what should I build next?"
```

### ✅ CORRECT Response Should Include:
1. Phase 1 complete (7/7 issues)
2. 18 components, 8 services, 13 screens exist
3. Database with 8 tables and 48 seed records
4. Next priority from phase tracking
5. References to specific documentation
6. Proof it read AI-README.md and PHASE_STATUS.md

### ❌ WRONG Response Would:
- "I don't have that information"
- Make up project status
- Not reference documentation
- Suggest random features without context

---

## 📊 Scoring

**Run all 10 tests in separate NEW conversations.**

### Excellent (9-10 correct)
- AI is properly reading documentation at startup
- Following established workflows
- ✅ Rules are working as intended

### Good (7-8 correct)
- Mostly following docs
- Minor improvements needed
- Review rules emphasis

### Needs Work (5-6 correct)
- Inconsistent doc reading
- May need stronger prompt engineering
- Consider making rules more explicit

### Poor (0-4 correct)
- Not following startup sequence
- Rules not being respected
- Need to escalate to Cursor support

---

## 🔍 What to Look For

In EVERY new conversation, the AI should:
1. **Mention** reading documentation
2. **Reference** specific files it read
3. **Cite** documentation when answering
4. **Check** existing code before suggesting new
5. **Know** project state (phase, components, services)

If it doesn't do these things, it's **NOT** following the startup sequence.

---

## 📝 Recording Results

For each test, note:
- Date/Time
- Test Number
- Pass/Fail
- Notes on behavior

Example:
```
Test 1 - Oct 10, 2025, 3:45 PM
Result: PASS ✅
Notes: AI immediately referenced manifests and listed all 18 components
```

---

## 🎯 What Success Looks Like

In a properly functioning setup, you should NEVER hear:
- "I don't know what components exist"
- "Let me create that from scratch" (when it exists)
- "What's the tech stack?" (it's in rules)
- "Sure, we can schedule cleanings anytime" (business rule violation)

You SHOULD always hear:
- "I checked docs/manifests/COMPONENTS.md..."
- "According to the phase status..."
- "I see that [component] already exists..."
- "That violates the cleaning window business rule..."

---

**Created:** October 10, 2025  
**Purpose:** Verify AI follows documentation-first approach  
**Target:** 100% pass rate on all tests

