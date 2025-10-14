# Testing Patterns

> Manual testing checklists and test patterns

## Manual Testing Checklist

### Role-Based Testing
- [ ] Test as property_owner
- [ ] Test as cleaner
- [ ] Test as co_host
- [ ] Test in demo mode
- [ ] Test with real Supabase

### Platform Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test in web browser
- [ ] Test on physical devices (if available)

### State Testing
- [ ] Test loading states
- [ ] Test success states
- [ ] Test error states
- [ ] Test empty states

### Edge Case Testing
- [ ] Test with no data
- [ ] Test with API failure
- [ ] Test with slow connection
- [ ] Test with invalid input
- [ ] Test with network offline

## Feature Testing Template

### Session Lifecycle Testing
```
1. Schedule Cleaning
   - [ ] Can create new session
   - [ ] Validates 11 AM - 3 PM window
   - [ ] Shows warning if outside window
   - [ ] Sends notification to cleaner

2. Cleaner Arrives
   - [ ] Cleaner can start session
   - [ ] Owner sees "in progress" status
   - [ ] Banner updates in real-time

3. Cleaner Works
   - [ ] Can add progress updates
   - [ ] Owner sees updates in real-time
   - [ ] Can upload photos

4. Cleaner Completes
   - [ ] PhotoProofGate validates photos
   - [ ] Cannot complete without minimum photos
   - [ ] Can complete with enough photos
   - [ ] Owner receives completion notification
```

### Photo Upload Testing
```
1. Upload Flow
   - [ ] Can take photos
   - [ ] Photos compress properly
   - [ ] Photos upload to Supabase
   - [ ] Photos display in UI

2. Validation
   - [ ] Minimum 3 photos enforced
   - [ ] Photo count updates correctly
   - [ ] Cannot complete without photos
   - [ ] Can complete with enough photos

3. Error Handling
   - [ ] Handles upload failure gracefully
   - [ ] Shows error message
   - [ ] Allows retry
```

## Business Rules Testing

### Cleaning Window (Rule 1)
- [ ] Cannot schedule outside 11 AM - 3 PM
- [ ] Shows error message for invalid times
- [ ] Validates time before saving

### Cancellation Notice (Rule 2)
- [ ] Calculates notice hours correctly
- [ ] Shows "SHORT NOTICE" if < 24 hours
- [ ] Blocks cancellation if < 1 hour
- [ ] Sends notification to cleaner

### Financial Privacy (Rule 3)
- [ ] Cleaners cannot see invoices
- [ ] Cleaners cannot see rates
- [ ] RoleBasedWrapper hides financial UI
- [ ] RLS policies enforce on backend

### Photo Proof (Rule 4)
- [ ] Minimum 3 photos required
- [ ] Cannot complete without photos
- [ ] PhotoProofGate enforces requirement
- [ ] Photos stored in Supabase

### Linen Calculation (Rule 5)
- [ ] Auto-calculates based on guest count
- [ ] Includes property-specific items
- [ ] Displays correct quantities
- [ ] Updates when guest count changes

## Performance Testing

### Load Time
- [ ] Dashboard loads in < 3 seconds
- [ ] Property list loads quickly
- [ ] Photos load efficiently

### Real-time Updates
- [ ] Updates appear within 1 second
- [ ] No lag in status changes
- [ ] Smooth UI updates

### Memory Usage
- [ ] No memory leaks
- [ ] Cleans up subscriptions
- [ ] Efficient list rendering

## Accessibility Testing

### Visual
- [ ] Text is readable
- [ ] Colors have sufficient contrast
- [ ] Touch targets are large enough

### Functional
- [ ] Can navigate with keyboard (web)
- [ ] Screen reader friendly (if applicable)
- [ ] Error messages are clear

## Regression Testing

### Critical Paths
- [ ] Login flow works
- [ ] Session creation works
- [ ] Session completion works
- [ ] Photo upload works
- [ ] Notifications work

### Recent Changes
- [ ] Test any recently modified features
- [ ] Verify no new bugs introduced
- [ ] Check related features still work

---

**Last Updated**: January 2025

