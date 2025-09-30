---
name: Phase 1: Bug Fix
about: Bug fixes for Phase 1 cleaner dashboard
title: "Phase 1: [BUG] [COMPONENT] - [BRIEF DESCRIPTION]"
labels: ["phase-1", "bug", "cleaner-dashboard"]
assignees: []
---

## Phase 1 Bug Fix

### Bug Summary
<!-- Brief description of the bug -->

### Affected Component/Service
<!-- Which part of the cleaner dashboard is broken -->

- [ ] CleanerDashboard (main dashboard)
- [ ] CleanerActiveSessionCard (current work display)
- [ ] CleanerNextJobCard (upcoming work display)
- [ ] CleanerStatusBanner (top guidance)
- [ ] CleanerTopBar (navigation/actions)
- [ ] CleaningUpdates (progress tracking)
- [ ] cleaningSessionService (data management)
- [ ] cleaningUpdateService (progress updates)
- [ ] Other: ________________

### Bug Description

**What's happening**: <!-- Describe the bug behavior -->

**What should happen**: <!-- Describe expected behavior -->

**When does it occur**: <!-- Steps to reproduce -->

### Reproduction Steps

1. 
2. 
3. 
4. 

### Environment Details

**Platform**: <!-- iOS/Android/Both -->
**Device**: <!-- Simulator/Physical device -->
**Network**: <!-- WiFi/Cellular/Offline -->
**User Role**: <!-- cleaner/property_owner/co_host -->

### Error Messages

<!-- Any error messages or console output -->

```
Paste error messages here
```

### Business Impact

**Cleaner Workflow Impact**:
- [ ] Blocks cleaning session completion
- [ ] Prevents progress updates
- [ ] Causes data loss
- [ ] Creates confusion/errors
- [ ] Minor UI issue

**User Experience Impact**:
- [ ] High - completely broken
- [ ] Medium - partially functional
- [ ] Low - cosmetic issue
- [ ] N/A - backend only

### Priority Assessment

**Severity**: <!-- Critical/High/Medium/Low -->
- Critical: Breaks core functionality
- High: Significantly impacts workflow
- Medium: Noticeable but workaround exists
- Low: Minor issue

**Urgency**: <!-- Immediate/This Sprint/Next Sprint/Backlog -->
- Immediate: Affects active users
- This Sprint: Should fix soon
- Next Sprint: Can wait
- Backlog: Nice to have

### Proposed Fix

**Suggested Solution**: <!-- How you think this should be fixed -->

**Files to Modify**:
- [ ] `components/________________.tsx`
- [ ] `services/________________.ts`
- [ ] `types/________________.ts`
- [ ] Other: ________________

### Testing Plan

**Before Fix**:
- [ ] Confirm bug reproduces consistently
- [ ] Document current behavior
- [ ] Test on multiple devices/platforms

**After Fix**:
- [ ] Verify bug is resolved
- [ ] Test related functionality
- [ ] Test edge cases
- [ ] Test on different user roles

### Regression Testing

**Related Features to Test**:
- [ ] Other cleaner dashboard components
- [ ] Real-time updates
- [ ] Data persistence
- [ ] User role permissions
- [ ] Mobile responsiveness

### Documentation Updates

- [ ] `CHANGELOG.md` - bug fix entry
- [ ] Component documentation
- [ ] Known issues documentation
- [ ] Other: ________________

---

**Ready for Development**: <!-- Check when ready -->
- [ ] Bug clearly described
- [ ] Reproduction steps provided
- [ ] Business impact assessed
- [ ] Priority assigned
