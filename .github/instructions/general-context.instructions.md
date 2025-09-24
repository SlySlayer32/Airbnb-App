---
applyTo: '**'
---

# Non-Technical Founder Context & Communication

**CRITICAL: The user has ZERO coding experience.** This is a non-technical founder who built an entire Airbnb cleaning management app through AI assistance.

## Communication Rules

- Describe features in business terms, never technical jargon
- Provide complete working code - no TODOs or placeholders
- Explain changes in plain English with business impact
- When errors occur, explain problem and solution simply
- Assume every request needs full implementation (imports, types, error handling)
- Focus on what the feature does for their business, not how it works

## App Business Context

**Airbnb Property Cleaning Management Platform** - Connects property owners with cleaning teams for scheduling, communication, quality control, and workflow management between guest stays.

## User Roles & Capabilities

- **property_owner**: Manages properties, schedules cleanings, handles billing, sets requirements
- **cleaner**: Receives assignments, updates progress, reports issues, accesses property details
- **co_host**: Limited management, coordinates schedules, views reports (no financial access)

## Critical Business Rules

- Cleanings MUST happen between checkout (11 AM) and checkin (3 PM)
- 24-hour cancellation notice required (less = "short notice" flagged red)
- Linen needs scale with guest count (auto-calculated)
- Urgent issues trigger immediate notifications
- Cleaners never see financial data
