# 🏠 Property Owner Management Card Component

**Epic**: Enhanced Property Management System  
**Phase**: 3 - Enhanced UI Components  
**Priority**: High  
**Estimated Time**: 2-3 days  
**Depends on**: Issue #1 (Database Schema), Issue #2 (Services)

## Overview
Create a comprehensive property management card for property owners that provides oversight, control, and professional session management capabilities. This component focuses on operational efficiency and accountability.

## Problem Statement
Property owners need:
- Clear overview of property occupancy and session status
- Professional cancellation workflow with reason tracking
- Real-time visibility into cleaner progress
- Easy session scheduling and team assignment
- Accountability measures for both sides of the relationship

## Requirements

### Property Overview Display
- [ ] **Property name and occupancy status** - Available, occupied, reserved
- [ ] **Property details** - Rooms, bathrooms, max occupancy
- [ ] **Current/next session information** - Guest count, timing, assigned cleaner
- [ ] **Property features summary** - Pool, hot tub, BBQ, special areas
- [ ] **Session timeline** - Check-out, cleaning, next check-in times

### Session Management
- [ ] **Session status tracking** - Scheduled, confirmed, in-progress, completed
- [ ] **Cleaner assignment display** - Who's assigned with contact info
- [ ] **Guest count and special requests** - Booking details
- [ ] **Real-time status updates** - Live progress from cleaner
- [ ] **Completion confirmation** - Photos and notes from cleaner

### Professional Cancellation Workflow
- [ ] **Cancellation button with confirmation** - Prevents accidental cancellations
- [ ] **Reason input modal** - Required explanation for transparency
- [ ] **Notice period calculation** - Automatic hours-until-service calculation
- [ ] **Short notice warnings** - Less than 24 hours highlighted
- [ ] **Compensation tracking** - Future feature for fairness

### Management Actions
- [ ] **Schedule cleaning** - Quick access to booking system
- [ ] **Assign cleaner** - Team member selection
- [ ] **Edit property** - Access to property settings
- [ ] **View history** - Past sessions and performance
- [ ] **Communication channel** - Direct contact with assigned cleaner

## Acceptance Criteria

### Visual Hierarchy
- [ ] Property status immediately obvious (occupied, available, etc.)
- [ ] Today's sessions highlighted with urgency
- [ ] Clean, professional design appropriate for business use
- [ ] Consistent with platform design system
- [ ] Mobile-responsive for on-the-go management

### Interaction Design
- [ ] Single-tap actions for common operations
- [ ] Confirmation dialogs for destructive actions
- [ ] Loading states for all async operations
- [ ] Smooth transitions between states
- [ ] Professional modal design for cancellation workflow

### Information Architecture
- [ ] Most important info (occupancy, today's session) above fold
- [ ] Secondary details accessible without overwhelming
- [ ] Clear visual separation between property info and session info
- [ ] Action buttons logically grouped and prioritized
- [ ] Emergency information easily accessible

### Cancellation UX
- [ ] Two-step cancellation process (button → confirmation → reason)
- [ ] Clear warning for short-notice cancellations
- [ ] Reason input with common options and custom text
- [ ] Immediate notification to affected cleaner
- [ ] Professional tone in all cancellation messaging