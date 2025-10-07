# 🤖 AI Prompting Guide

> Effective communication templates for AI-assisted development

## 📋 Table of Contents
- [Communication Principles](#communication-principles)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)
- [Code Understanding](#code-understanding)
- [Refactoring](#refactoring)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

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

### Template 1: New Feature (Simple)
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

### Template 2: New Feature (Complex)
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
- [Who can delete]

Why this matters:
[Business value explanation]

Edge Cases to Handle:
- [Edge case 1]
- [Edge case 2]
```

**Example**:
```
I want to add a "cleaning quality rating" system for property owners.

User Story:
As a property owner, I want to rate completed cleanings, so that I can track cleaner performance and identify training needs.

What it should do:
1. After a cleaning is marked complete, owner gets a notification to rate it
2. Owner opens the completed cleaning and sees a rating modal
3. Owner selects 1-5 stars and optionally adds written feedback
4. Rating is saved and visible to owner only (not to cleaner)
5. Average rating per cleaner is shown on team management screen

Business Rules:
- Ratings can only be given within 48 hours of completion
- Once submitted, ratings cannot be changed
- Cleaners never see individual ratings (only aggregate score)

Permissions:
- Property owners can rate any cleaning on their properties
- Co-hosts can view ratings but not submit new ones
- Cleaners cannot see ratings at all

Why this matters:
Owners need to track quality over time and identify which cleaners consistently deliver good work vs which need coaching.

Edge Cases to Handle:
- What if owner never rates? (Don't require it, but send reminder after 24 hours)
- What if owner rates the same cleaning twice? (Show error: already rated)
- What if cleaning was cancelled? (Don't allow rating)
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

### Template: Find Code Location
```
Where is the code that handles [specific functionality]?

What I'm looking for:
[Description of the functionality]

What I plan to do:
[Why you need to find it]
```

**Example**:
```
Where is the code that handles calculating linen requirements based on guest count?

What I'm looking for:
The function that takes a guest count and returns how many towels, sheets, etc. are needed

What I plan to do:
I want to modify it to also calculate pool towels for properties with pools
```

---

## ♻️ Refactoring

### Template: Improve Existing Code
```
Improve [component/service/function] to follow our patterns without changing functionality.

Current Issues:
- [Issue 1]
- [Issue 2]

What Should Stay the Same:
[Functionality that must not break]

What Can Change:
[Code organization, naming, patterns]
```

**Example**:
```
Improve the CleanerPropertyCard component to follow our patterns without changing functionality.

Current Issues:
- Uses inline styles instead of StyleSheet
- Doesn't have proper error handling
- Missing loading state
- Doesn't follow our standard card design

What Should Stay the Same:
- All displayed information (access codes, WiFi, etc.)
- The onPress behavior
- The overall layout

What Can Change:
- Code organization
- Style definitions
- Error handling approach
- Loading state implementation
```

---

### Template: Split Large Component
```
Split [large component] into smaller, reusable components.

Current Component:
[Component name and file path]

Why Split:
- [Reason 1: e.g., too long, hard to maintain]
- [Reason 2: e.g., parts could be reused]

Suggested Structure:
[How you think it could be organized]
```

**Example**:
```
Split CleaningUpdates component into smaller, reusable components.

Current Component:
components/CleaningUpdates.tsx (400+ lines)

Why Split:
- Component is over 400 lines long
- Update list and message input could be separate
- Update cards are defined inline and could be extracted
- Hard to find specific functionality

Suggested Structure:
- CleaningUpdates.tsx (main container)
- CleaningUpdateList.tsx (displays update feed)
- CleaningUpdateCard.tsx (individual update)
- CleaningMessageInput.tsx (message compose area)
```

---

## 📝 Documentation

### Template: Document Changes
```
Document the changes made to [files/features] in business terms.

What Changed:
[List of modified files or features]

Target Audience:
[Who needs to understand: non-technical founder / developers / stakeholders]

Level of Detail:
[High-level overview / detailed technical explanation]
```

**Example**:
```
Document the changes made to the photo proof system in business terms.

What Changed:
- PhotoProofGate component
- photoProofService
- cleaningSessionService (completion flow)

Target Audience:
Non-technical founder explaining feature to investors

Level of Detail:
High-level overview focusing on business value, not technical implementation
```

---

### Template: Create User Guide
```
Create a user guide for [feature] for [user role].

Include:
- How to access the feature
- Step-by-step instructions
- Screenshots/descriptions of each screen
- Common questions
- Tips and best practices
```

**Example**:
```
Create a user guide for the cleaning session workflow for cleaners.

Include:
- How to access assigned jobs
- Step-by-step instructions for marking arrived, in-progress, complete
- What happens at each step
- How to report issues during cleaning
- How to upload completion photos
- Common questions (e.g., "What if I forget to mark arrived?")
- Tips (e.g., "Upload photos as you go, not at the end")
```

---

## 🔧 Troubleshooting

### Template: Debug Issue
```
Help me debug this issue:

What I'm Trying to Do:
[Description of intended action]

What's Happening:
[Description of problem]

What I've Tried:
- [Attempt 1]
- [Attempt 2]

Relevant Code:
[File paths or code snippets if available]

Error Messages:
[Any errors from console or UI]
```

**Example**:
```
Help me debug this issue:

What I'm Trying to Do:
Load the cleaner's assigned properties when they open the properties screen

What's Happening:
Screen shows loading spinner forever, properties never appear

What I've Tried:
- Checked that user is logged in (they are)
- Verified cleaner role is set correctly (it is)
- Looked at network tab, no API calls being made

Relevant Code:
- app/properties.tsx (the screen)
- services/propertyService.ts (getPropertiesForCleaner method)

Error Messages:
Console shows: "Cannot read property 'id' of undefined"
```

---

### Template: "It's Not Working"
```
[Feature] isn't working as expected.

What I Expected:
[Expected behavior in detail]

What Actually Happened:
[Actual behavior in detail]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Observe problem]

When This Started:
[After specific change / Always been this way / Unknown]
```

**Example**:
```
Photo upload isn't working as expected.

What I Expected:
When cleaner taps "Upload Photo", camera opens, they take photo, photo appears in completion screen

What Actually Happened:
Camera opens, cleaner takes photo, but nothing happens after - photo doesn't appear

Steps to Reproduce:
1. Login as cleaner
2. Open active cleaning session
3. Tap "Complete Session"
4. In photo proof screen, tap "Take Photo"
5. Camera opens, take photo
6. Photo doesn't appear in the list

When This Started:
After I added the new photo validation feature yesterday
```

---

## 🎯 Advanced Prompting Tips

### 1. Provide Context from Documentation
```
I want to [request].

According to [COMPONENT_MANIFEST / SERVICE_MANIFEST / CONVENTIONS], 
[relevant pattern or standard].

Apply that pattern to this request.
```

---

### 2. Reference Existing Features
```
I want [new feature] to work similar to [existing feature].

Key similarities:
- [Similarity 1]
- [Similarity 2]

Key differences:
- [Difference 1]
- [Difference 2]
```

---

### 3. Break Down Complex Requests
```
I want to [complex feature].

Let's break this into steps:
1. First, [step 1] - do this first
2. Then, [step 2] - build on step 1
3. Finally, [step 3] - complete the feature

Start with step 1.
```

---

### 4. Request Explanations First
```
Before implementing [feature], explain:
1. How it fits into the existing architecture
2. What components/services will be affected
3. Any potential conflicts with existing features
4. Recommended approach

Then implement if the approach makes sense.
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

---

**Last Updated**: January 2025  
**Maintenance**: Add new templates as patterns emerge
