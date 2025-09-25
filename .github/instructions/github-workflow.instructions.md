---
applyTo: '**'
---

# GitHub Pre-Push Workflow & Documentation Updates

**Note**: This workflow now works with Cursor AI. Feature requests should automatically generate GitHub issues via the new GitHub integration workflow.

## Complete Pre-Push Checklist

**Before every GitHub push, follow this exact sequence to maintain complete AI context and roadmap alignment:**

### Phase 1: Code & Testing Verification

- [ ] **Test app functionality**: `npx expo start` and verify all features work
- [ ] **Check for TypeScript errors**: Resolve all type issues
- [ ] **Verify no console.logs**: Remove debug statements
- [ ] **Test on device**: Ensure mobile functionality works correctly

### Phase 2: Documentation Updates

- [ ] **Update CHANGELOG.md**: Add entry for all changes made
- [ ] **Update relevant roadmap docs** (see Current Documentation Files section)
- [ ] **Update VERSION.md**: Increment version if significant changes
- [ ] **Update README.md**: If new features or setup changes

### Phase 3: AI Context Maintenance

- [ ] **Document implementation approach**: How the feature was built
- [ ] **Record business decisions**: Why certain choices were made
- [ ] **Update type definitions**: If new data structures added
- [ ] **Note future considerations**: What to watch out for or improve next

### Phase 4: Git Workflow

- [ ] **Stage all files**: `git add .`
- [ ] **Create descriptive commit**: Follow commit message format below
- [ ] **Push to GitHub**: `git push origin main`
- [ ] **Update Wiki** (if major changes): Link to GitHub Wiki

## Current Documentation Files to Update

Based on the type of change, update these files:

### 🚀 **For New Features**

- `COMPLETE_PRODUCT_ROADMAP.md` - Update feature completion status
- `USER_WORKFLOW_ANALYSIS.md` - Update workflow completion percentages
- `INTERACTIVE_TESTING_RESULTS.md` - Update testing results and checklist completion
- `SUCCESS_METRICS_FRAMEWORK.md` - Update KPI progress if applicable

### 🐛 **For Bug Fixes**

- `INTERACTIVE_TESTING_RESULTS.md` - Update issue resolution status
- `VISUAL_WORKFLOW_DIAGRAMS.md` - Update if workflow changed
- `SUCCESS_METRICS_FRAMEWORK.md` - Update stability metrics

### 🔧 **For Technical Improvements**

- `THIRD_PARTY_INTEGRATIONS.md` - If integration-related
- `EXECUTIVE_SUMMARY.md` - If architecture changes
- All relevant instruction files in `.github/instructions/`

### 📊 **For Business Logic Changes**

- `USER_WORKFLOW_ANALYSIS.md` - If user experience changed
- `VISUAL_WORKFLOW_DIAGRAMS.md` - Update flowcharts if needed
- `COMPLETE_PRODUCT_ROADMAP.md` - Adjust timeline if scope changed

## Commit Message Format

Use this exact format for consistency:

```
[TYPE]: Brief description (affects: user_role)

- Specific change 1
- Specific change 2  
- Business impact/value

Docs updated: List of documentation files updated
```

### Commit Types

- **FEATURE**: New functionality
- **FIX**: Bug fixes
- **REFACTOR**: Code improvements without feature changes
- **DOCS**: Documentation-only changes
- **PERF**: Performance improvements
- **SETUP**: Configuration or dependency changes

### Examples

```bash
# Feature commit
git commit -m "FEATURE: Add real-time cleaning notifications (affects: property_owner, cleaner)

- Implemented Supabase real-time subscriptions for cleaning_sessions table
- Added notification badge component with unread count
- Created notification service with push notification support
- Business impact: Reduces communication delays by 90%

Docs updated: COMPLETE_PRODUCT_ROADMAP.md, USER_WORKFLOW_ANALYSIS.md, INTERACTIVE_TESTING_RESULTS.md"

# Bug fix commit
git commit -m "FIX: Resolve linen calculation for properties >6 guests (affects: cleaner)

- Fixed multiplier logic in calculateLinenRequirements function
- Added boundary condition handling for large groups
- Updated CleanerPropertyCard to display correct quantities
- Business impact: Prevents cleaner preparation errors

Docs updated: INTERACTIVE_TESTING_RESULTS.md"

# Documentation commit  
git commit -m "DOCS: Update roadmap progress and testing results

- Marked notification system as 100% complete in roadmap
- Updated workflow completion from 60% to 75%
- Added new integration opportunities analysis
- Refined success metrics based on testing feedback

Docs updated: COMPLETE_PRODUCT_ROADMAP.md, SUCCESS_METRICS_FRAMEWORK.md, THIRD_PARTY_INTEGRATIONS.md"
```

## AI Context Recording Template

**For every significant change, record this information:**

### Implementation Context

```markdown
## Change: [Brief Description]
**Date**: [Current Date]
**Affected Roles**: [property_owner/cleaner/co_host]
**Files Modified**: [List of key files]

### Business Problem Solved
[Explain the business need this addresses]

### Technical Approach  
[How was this implemented - key decisions and patterns used]

### Future Considerations
[What to watch out for, potential improvements, or next steps]

### Testing Notes
[How this was tested and what to verify in future changes]
```

### Example Context Record

```markdown
## Change: Real-time Cleaning Notifications
**Date**: September 23, 2025
**Affected Roles**: property_owner, cleaner
**Files Modified**: services/notificationService.ts, components/NotificationBadge.tsx, app/_layout.tsx

### Business Problem Solved
Property owners needed instant updates when cleaners start/complete work to manage multiple properties efficiently and respond to issues quickly.

### Technical Approach
- Used Supabase real-time subscriptions on cleaning_sessions table
- Created NotificationBadge component with unread count state management
- Implemented notification service with background task handling
- Added notification permissions handling in app startup

### Future Considerations  
- May need rate limiting if high-frequency updates cause performance issues
- Consider adding notification preferences/settings screen
- Plan for offline notification queueing when connection poor

### Testing Notes
- Test real-time updates with multiple devices
- Verify notification permissions on iOS/Android
- Check background app behavior with notifications
```

## Documentation Update Workflow

### For Major Features (New Screens/Workflows)

1. **Update USER_WORKFLOW_ANALYSIS.md**:
   - Increment workflow completion percentages
   - Add new user journey steps if applicable
   - Update persona needs analysis

2. **Update VISUAL_WORKFLOW_DIAGRAMS.md**:
   - Modify Mermaid diagrams to include new flow
   - Update current vs future state comparisons
   - Add new decision points or user actions

3. **Update COMPLETE_PRODUCT_ROADMAP.md**:
   - Mark completed milestones  
   - Adjust timeline if scope changed
   - Update feature completion status

4. **Update INTERACTIVE_TESTING_RESULTS.md**:
   - Add new testing scenarios
   - Update completion percentages
   - Document any issues discovered

### For Infrastructure/Integration Changes

1. **Update THIRD_PARTY_INTEGRATIONS.md**:
   - Add newly implemented integrations
   - Update integration status and findings
   - Document API keys or setup requirements

2. **Update EXECUTIVE_SUMMARY.md**:
   - Reflect architectural changes
   - Update technical capabilities summary
   - Adjust competitive advantages if applicable

### For Performance/Business Impact

1. **Update SUCCESS_METRICS_FRAMEWORK.md**:
   - Record actual performance improvements
   - Update KPI progress towards targets
   - Document user feedback or usage analytics

## Pre-Push Command Sequence

Use this exact sequence every time:

```bash
# 1. Verify app works
npx expo start
# Test key functionality, then Ctrl+C

# 2. Check git status
git status

# 3. Review changes
git diff

# 4. Stage all changes
git add .

# 5. Commit with detailed message
git commit -m "[TYPE]: Description (affects: roles)

- Change 1
- Change 2
- Business impact

Docs updated: file1.md, file2.md"

# 6. Push to GitHub
git push origin main

# 7. Update GitHub Wiki if major changes
# (Open browser to https://github.com/SlySlayer32/Airbnb-App/wiki)
```

## Weekly Documentation Review

**Every Friday, review and update:**

- [ ] **Progress against roadmap milestones**
- [ ] **Success metrics and KPI progress**
- [ ] **Integration opportunities discovered**
- [ ] **User feedback or testing insights**
- [ ] **Technical debt or future improvement notes**

This ensures the AI always has complete, current context for making optimal decisions on future development.

## Success Criteria

This workflow is successful when:

1. **Every commit has complete context** - AI can understand exactly what changed and why
2. **Documentation stays current** - Roadmap and analysis docs reflect actual progress
3. **Business impact is tracked** - Each change connects to user value and business goals
4. **Future development is informed** - AI has historical context for making better decisions
5. **Project continuity is maintained** - Anyone (AI or human) can understand the full project evolution

Remember: Consistent documentation is what enables AI to be your complete technical co-founder who understands the full business and technical context.
