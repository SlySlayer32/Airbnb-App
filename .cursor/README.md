# Cursor Rules Setup Guide

This folder contains two rule files optimized for Cursor Settings:

## Files Overview

### 📋 PROJECT_RULES.md
**What it is**: Airbnb app-specific rules  
**Where it goes**: Cursor Settings → Project Rules  
**What it contains**:
- App description (cleaning management platform)
- 5 critical business rules (cleaning window, cancellation, privacy, photo proof, linen calc)
- Tech stack (React Native, Expo, Supabase, TypeScript)
- Code patterns and examples
- File organization structure
- Design system (colors, spacing, naming)
- Reference to docs/ folder

**Use this when**: Working on THIS project only

---

### 👤 USER_RULES.md
**What it is**: Non-technical founder communication style  
**Where it goes**: Cursor Settings → User Rules  
**What it contains**:
- Plain language communication standards
- Complete code delivery requirements
- Strategic development guidance
- GitHub issue/PR tracking format
- Quality assurance checklist
- Response structure template

**Use this when**: Working on ANY project (global settings)

---

## How to Apply These Rules

### Step 1: Open Cursor Settings
- Press `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
- Or go to: File → Preferences → Settings

### Step 2: Navigate to Rules Section
- In settings search bar, type: "rules"
- Look for sections labeled:
  - **"Cursor Rules for AI"** or **"Rules"**
  - You'll see two text boxes: "User Rules" and "Project Rules"

### Step 3: Copy Project Rules
1. Open `.cursor/PROJECT_RULES.md`
2. Select all content (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. Paste into **"Project Rules"** text box in Cursor Settings
5. Click "Save" or just close (auto-saves)

### Step 4: Copy User Rules
1. Open `.cursor/USER_RULES.md`
2. Select all content (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. Paste into **"User Rules"** text box in Cursor Settings
5. Click "Save" or just close (auto-saves)

---

## What's the Difference?

| Aspect | Project Rules | User Rules |
|--------|--------------|------------|
| **Scope** | This Airbnb app only | All your projects |
| **Focus** | Technical patterns, business logic | Communication style |
| **Contains** | App specifics, code examples | How AI should talk to you |
| **Changes when** | App evolves (new features) | Rarely (your preferences) |
| **Travels with** | This project workspace | Your Cursor installation |

---

## How They Work Together

When you work on this Airbnb app:
1. **User Rules** tell AI: "Explain in plain language, give complete code, suggest next steps"
2. **Project Rules** tell AI: "This is a cleaning app with 4-hour windows, use TypeScript, follow these patterns"
3. **Combined**: AI acts as a strategic technical lead who speaks plainly and knows your app deeply

---

## Testing the Setup

After applying both rules, start a new chat and try:

```
"Add a button to the cleaner dashboard that shows today's cleaning count"
```

**What you should see**:
✅ AI confirms in plain language: "We're building a counter display..."
✅ Complete working code (no TODOs)
✅ Follows existing component patterns
✅ Uses correct colors/spacing from design system
✅ Suggests next step: "The logical next development step is..."
✅ Mentions GitHub issue creation

---

## Updating the Rules

### When to Update Project Rules
- Adding new business rules
- Changing tech stack
- New component patterns
- Updated design system

**How**: Edit `.cursor/PROJECT_RULES.md`, then re-copy to Cursor Settings

### When to Update User Rules
- You want AI to communicate differently
- New workflow preferences (like code review)
- Different project management style

**How**: Edit `.cursor/USER_RULES.md`, then re-copy to Cursor Settings

---

## Troubleshooting

### "AI isn't following the rules"
- **Solution**: Check both rule boxes have content
- Sometimes Cursor needs restart after big rule changes
- Try: Close Cursor → Reopen → Start new chat

### "Rules are too long"
- **Solution**: They're comprehensive by design
- AI reads these fast (< 1 second)
- More detail = better behavior

### "I want different rules per project"
- **Solution**: That's what Project Rules are for!
- User Rules stay the same (your communication style)
- Project Rules change per project (tech specifics)

---

## Version Control

These files are in git for:
1. **Backup**: Never lose your carefully crafted rules
2. **Sharing**: Share with team members or other founders
3. **History**: Track how rules evolved over time
4. **Reference**: Easy to copy when setting up new computer

---

## Need Help?

If AI behavior seems off:
1. Verify both rules are in Cursor Settings
2. Check for any typos when copying
3. Restart Cursor
4. Try a fresh chat window

---

**Last Updated**: January 2025  
**Maintained By**: Project owner  
**Purpose**: Empower non-technical founders to build with AI

