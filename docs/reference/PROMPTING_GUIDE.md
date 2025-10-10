# 🤖 AI Prompting Guide

> Effective communication templates for AI-assisted development

## 📋 Table of Contents
- [Communication Principles](#communication-principles)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)
- [Code Understanding](#code-understanding)
- [Refactoring](#refactoring)

---

## 💬 Communication Principles

### How to Talk to AI About This Project

**✅ DO:**
- Use plain English to describe what you want
- Mention which user role is affected (property_owner, cleaner, co_host)
- Describe the business problem, not technical implementation
- Reference existing features for comparison
- Be specific about expected behavior

**❌ DON'T:**
- Use technical jargon unless necessary
- Assume AI knows about recent conversations (always provide context)
- Ask for partial implementations (always request complete solutions)
- Skip mentioning user roles or permissions

### Example Conversation Starters

**Good**:
> "I want cleaners to see a list of properties they're assigned to, with access codes displayed prominently so they can get in quickly."

**Better**:
> "I want cleaners to see a list of properties they're assigned to, with access codes displayed prominently so they can get in quickly. This should work similar to how the owner property list works, but show different information. Cleaners should also see WiFi passwords and cleaning supply locations."

---

## 🚀 Feature Requests

### Template: New Feature (Simple)
```
I want to add [feature name] for [user role(s)].

What it should do:
- [Specific behavior 1]
- [Specific behavior 2]
- [Specific behavior 3]

Why this matters:
[Business value explanation]

Similar to:
[Reference existing feature if applicable]
```

**Example**:
```
I want to add a "favorite properties" feature for cleaners.

What it should do:
- Cleaners can mark properties as favorites by tapping a star icon
- Favorite properties appear at the top of their property list
- They can unfavorite by tapping the star again

Why this matters:
Cleaners often work at the same properties repeatedly. This helps them find their regular properties faster, saving time.

Similar to:
Like how the property list already shows properties, but with a star icon and sorting by favorites first.
```

---

### Template: New Feature (Complex)
```
I want to add [feature name] for [user role(s)].

User Story:
As a [role], I want to [action], so that [benefit]

What it should do:
1. [Step 1 of user flow]
2. [Step 2 of user flow]
3. [Step 3 of user flow]

Business Rules:
- [Rule 1 to enforce]
- [Rule 2 to enforce]

Permissions:
- [Who can view]
- [Who can edit]

Why this matters:
[Business value explanation]

Edge Cases to Handle:
- [Edge case 1]
- [Edge case 2]
```

---

## 🐛 Bug Reports

### Template: Bug Report
```
There's an issue when [specific action].

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happens]

User Role Affected:
[property_owner / cleaner / co_host / all]

Error Messages (if any):
[Copy/paste any error text]

When This Happens:
[Always / Sometimes / Specific conditions]
```

**Example**:
```
There's an issue when cleaners try to mark a session as complete.

Steps to Reproduce:
1. Login as a cleaner
2. Open an active cleaning session
3. Tap "Mark Complete" button
4. App shows loading spinner but never completes

Expected Behavior:
Session should be marked as complete, show a success message, and return to dashboard

Actual Behavior:
Loading spinner shows indefinitely, no success message, session stays in "in_progress" status

User Role Affected:
Cleaner only (owners can still mark sessions complete from their side)

Error Messages (if any):
In console: "Error: Missing required field 'photo_urls'"

When This Happens:
Always happens when trying to complete any session
```

---

## 🔍 Code Understanding

### Template: Explain How Something Works
```
Explain how [feature/component/service] works from the [user perspective / technical perspective].

Specifically, I want to understand:
- [Question 1]
- [Question 2]
- [Question 3]

Context:
[Why you need to understand this]
```

**Example**:
```
Explain how the cleaning session lifecycle works from the cleaner perspective.

Specifically, I want to understand:
- What happens when a cleaner marks themselves as "arrived"?
- What notifications get sent and when?
- How does the status change from scheduled → in_progress → completed?
- What data gets recorded at each step?

Context:
I want to add a "pause session" feature and need to understand the current flow first.
```

---

## ✅ Prompting Success Criteria

Your prompts are effective when:
1. ✅ AI provides complete working code, not partial solutions
2. ✅ AI follows existing patterns automatically
3. ✅ AI asks clarifying questions when needed
4. ✅ AI explains changes in business terms
5. ✅ AI considers edge cases without prompting
6. ✅ AI updates documentation proactively

---

**Remember**: The more context you provide, the better the AI can help. Always mention:
- User roles affected
- Business value / why it matters
- Similar existing features
- Expected behavior vs actual behavior (for bugs)

