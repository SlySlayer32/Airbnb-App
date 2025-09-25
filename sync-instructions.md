# Cursor ↔ GitHub Instructions Synchronization Guide

## Current Status

You now have **two instruction systems** that need to stay synchronized:

### 1. `.cursor/rules/` - For Cursor AI
- `airbnb-app-master.mdc` - Master coordination file
- `general-context.mdc` - Non-technical founder communication
- `components.mdc` - Component development patterns
- `services.mdc` - Service layer patterns  
- `screens.mdc` - Screen development patterns
- `types.mdc` - TypeScript definitions
- `debugging.mdc` - Debugging guidance
- `documentation.mdc` - Documentation standards
- `feature-development.mdc` - Feature implementation process
- `github-integration.mdc` - **NEW**: GitHub issue creation workflow

### 2. `.github/instructions/` - For GitHub Copilot (Legacy)
- `copilot.instructions.md` - Master file (references Copilot)
- `general-context.instructions.md` - Same content as Cursor version
- `github-workflow.instructions.md` - **UNIQUE**: Pre-push workflow & documentation
- Other instruction files matching Cursor versions

## Synchronization Strategy

### Option 1: Keep Both Systems (Recommended)
- Keep `.cursor/rules/` for Cursor-specific functionality
- Keep `.github/instructions/` for GitHub workflow and legacy reference
- Manually sync when making major changes to patterns

### Option 2: Single Source of Truth
- Use `.cursor/rules/` as the primary source
- Update `.github/instructions/copilot.instructions.md` to reference Cursor files
- Keep `.github/instructions/github-workflow.instructions.md` for workflow

## Key Differences Found

### 1. GitHub Workflow Instructions
- **Location**: `.github/instructions/github-workflow.instructions.md`
- **Purpose**: Detailed pre-push checklist, commit formats, documentation update requirements
- **Status**: Needs to be updated for Cursor usage instead of Copilot

### 2. Master Instructions
- **GitHub Version**: References "Copilot" throughout
- **Cursor Version**: References "Cursor" and includes newer enhancements
- **Action Needed**: Update GitHub version to match Cursor approach

### 3. New Cursor-Specific Files
- **`github-integration.mdc`**: New file for creating GitHub issues from Cursor
- **Enhanced patterns**: Updated with pre-build checklists, business context, etc.

## Immediate Actions Needed

### 1. Update GitHub Master Instructions
The `.github/instructions/copilot.instructions.md` file still references "Copilot" throughout. You should:
- Rename it to `cursor.instructions.md`  
- Replace "Copilot" with "Cursor"
- Add the new delivery playbook from the Cursor master file

### 2. Update GitHub Workflow for Cursor
The `.github/instructions/github-workflow.instructions.md` needs minor updates:
- Change references from "GitHub Copilot" to "Cursor"
- Add reference to the new GitHub issue creation workflow
- Maintain all the existing documentation requirements

### 3. Test the New GitHub Issue Workflow
When you ask Cursor for a new feature, it should now:
- Create a comprehensive GitHub issue with implementation plan
- Implement the feature following established patterns
- Update documentation per the issue checklist
- Provide you with a business-friendly summary

## Quick Test

Try this request: **"I need a quick action button for property owners to mark a cleaning as urgent"**

Cursor should:
1. Generate a GitHub issue with full implementation plan
2. Implement the feature with proper TypeScript types, service methods, and UI components
3. Follow all business rules (role permissions, error handling, etc.)
4. Update documentation and provide you a summary

## Benefits of This Setup

### For You as Non-Technical Founder
- **Same workflow as before**: Ask for features in plain English
- **Automatic GitHub tracking**: Every feature gets a proper issue with implementation plan
- **Complete documentation**: All changes tracked for future AI context
- **Business focus**: Everything explained in business terms, not technical jargon

### For Future Development
- **AI context preserved**: Complete history of decisions and implementations
- **Consistent patterns**: All new code follows established patterns automatically
- **Quality gates**: Built-in checks for TypeScript, testing, business rules
- **Scalable**: Easy to hand off to other developers or AI assistants later

## Next Steps

1. **Test the new workflow** with a feature request
2. **Update the GitHub master instructions** to reference Cursor instead of Copilot
3. **Keep both instruction systems synchronized** when making major pattern changes
4. **Use the GitHub issue creation** for all significant features to maintain your documentation workflow

The system is now set up to work exactly like your previous Copilot workflow, but with enhanced patterns and better business context integration.
