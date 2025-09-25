# Cursor Rules for Airbnb Cleaning Management Platform

This directory contains Cursor-specific instructions that transform the GitHub instructions into a format optimized for Cursor's AI assistant.

## Rule Files Overview

### Core Rules
- **`airbnb-app-master.mdc`** - Master instructions that apply to all files
- **`general-context.mdc`** - Non-technical founder communication guidelines
- **`test.mdc`** - Example file showing rule structure

### Domain-Specific Rules
- **`components.mdc`** - Component development patterns and design system
- **`services.mdc`** - Service layer patterns and business logic
- **`screens.mdc`** - Screen development and navigation patterns
- **`types.mdc`** - TypeScript definitions and interface patterns
- **`debugging.mdc`** - Common issues and debugging guidance
- **`feature-development.mdc`** - Complete feature implementation process
- **`documentation.mdc`** - Changelog and commit standards

## How Cursor Rules Work

### File Structure
Each `.mdc` file contains:
```yaml
---
description: What the rule covers
globs: ["file/patterns/**/*.tsx"]  # Which files this applies to
alwaysApply: true/false            # Apply to all files or only matching patterns
---

# Rule content in markdown
```

### Rule Application
- **`alwaysApply: true`** - Rule applies to all files (like master and general-context)
- **`alwaysApply: false`** - Rule only applies to files matching the `globs` patterns
- **`globs`** - File patterns using glob syntax to target specific file types

### Examples
- `components.mdc` applies to `components/**/*.tsx`, `app/**/*.tsx`, and `contexts/**/*.tsx`
- `services.mdc` applies to `services/**/*.ts` and `lib/**/*.ts`
- `types.mdc` applies to `types/**/*.ts` and `**/*.d.ts` files
- `debugging.mdc` applies to test, debug, and error files
- `documentation.mdc` applies to `CHANGELOG.md`, `README.md`, and `docs/**/*.md`
- `feature-development.mdc` applies to main development directories

## Key Features

### Business Context
- Non-technical founder communication
- Business value focus over technical details
- User role-based development patterns
- Real-world Airbnb property management scenarios

### Technical Patterns
- Consistent component templates
- Service layer architecture
- TypeScript type definitions
- Error handling patterns
- Performance guidelines

### Development Workflow
- Feature implementation checklist
- Code quality standards
- Testing and debugging guidance
- Documentation requirements

## Usage

1. **Start a new chat** with Cursor
2. **Mention what you want to build** - Cursor will automatically apply relevant rules
3. **Specify the user role** - property_owner, cleaner, or co_host
4. **Describe the business need** - Cursor will handle technical implementation

## Example Prompts

### For Property Owners
> "I need a way for property owners to see all their cleaning schedules in one place"

### For Cleaners  
> "Cleaners need to see access codes and guest count prominently when they arrive at a property"

### For Co-Hosts
> "Co-hosts should be able to view reports but not modify billing information"

## Rule Customization

To modify rules:
1. Edit the relevant `.mdc` file
2. Update the `globs` patterns if needed
3. Adjust `alwaysApply` setting
4. Test with a new Cursor chat

## Business Rules Enforced

- **4-hour cleaning window** (11 AM - 3 PM)
- **24-hour cancellation notice** requirement
- **Linen requirements** scale with guest count
- **Financial privacy** for cleaners
- **Role-based access control** throughout

## Success Metrics

Rules are working when:
- Business features described naturally get working code
- New code follows existing patterns automatically
- Technical details handled without user awareness
- App maintains consistency as features are added
- Errors explained in simple terms
- Every request gets complete implementation

## Support

These rules are designed to make Cursor act as a complete technical co-founder who handles all complexity while the user focuses on growing their business.
