# Technical Excellence Rules - Airbnb Cleaning App

## Core Principle
**Write complete, working code immediately. Focus on technical implementation, not explanations.**

## Project Context
- **Platform**: Expo React Native + TypeScript + Supabase
- **Architecture**: File-based routing, service layer, role-based access
- **Users**: property_owner, cleaner, co_host
- **Business Rules**: 4-hour cleaning window (11 AM-3 PM), 24-hour cancellation notice, cleaners never see financial data

## Technical Standards

### TypeScript Requirements
- **No `any` types** - Use proper interfaces and types
- **Complete type definitions** - All functions, props, and state must be typed
- **Interface consistency** - Follow existing type patterns in `/types/index.ts`

### React Native/Expo Patterns
- **Expo Router** - Use file-based routing with typed routes
- **StyleSheet** - Use React Native StyleSheet, no external CSS
- **Ionicons** - Use @expo/vector-icons (Ionicons only)
- **Mobile-first** - Responsive design for different screen sizes

### Code Completeness
- **No TODOs or placeholders** - Every response must include complete, working code
- **All imports included** - Every file must have proper import statements
- **Error handling** - All async operations must handle loading, success, and error states
- **State management** - Use React Context for auth, useState for UI state

### Service Layer Patterns
- **Supabase integration** - Use existing service patterns in `/services/`
- **Error handling** - All service calls must handle errors gracefully
- **Loading states** - Show loading indicators during async operations
- **Type safety** - All service functions must be properly typed

### Component Standards
- **Role-based access** - Use `RoleBasedWrapper` for access control
- **Consistent styling** - Follow existing color scheme and spacing
- **Props validation** - All props must be properly typed
- **Reusability** - Components should be reusable and well-structured

### Business Logic Implementation
- **Cleaning window validation** - Prevent scheduling outside 11 AM-3 PM window
- **Cancellation notice** - Calculate and display notice period in hours
- **Linen scaling** - Auto-calculate linen needs based on guest count
- **Urgent escalation** - Handle urgent issues with immediate notifications
- **Financial privacy** - Cleaners never see pricing or financial data

## Implementation Requirements

### Every Code Response Must Include:
1. **Complete working code** - No incomplete implementations
2. **Proper imports** - All necessary dependencies included
3. **TypeScript types** - All functions and variables typed
4. **Error handling** - Loading, success, and error states
5. **Role-based access** - Proper access control where needed
6. **Business rule compliance** - Follow cleaning window and other constraints

### Quality Gates
- **Linting** - Code must pass ESLint and TypeScript checks
- **Testing** - Manual verification of success and error scenarios
- **Pattern consistency** - Follow existing codebase patterns exactly
- **Business validation** - Ensure business rules are properly implemented

## File Organization
- **Components**: `/components/` - Reusable UI components
- **Services**: `/services/` - Business logic and Supabase queries
- **Types**: `/types/index.ts` - TypeScript definitions
- **Screens**: `/app/` - Expo Router screens
- **Contexts**: `/contexts/` - React contexts for state management

## Success Criteria
- **Code works immediately** - No debugging or additional setup required
- **Follows existing patterns** - Consistent with current codebase
- **Handles all edge cases** - Loading, error, and empty states
- **Business rules enforced** - Proper validation and constraints
- **Type safe** - No TypeScript errors or warnings

## What NOT to Include
- Verbose business explanations
- Automatic GitHub workflow requirements
- Repetitive rule structures
- Over-constraining "MUST" statements
- Excessive communication rules

**Focus on: Write code that works. Make it complete. Follow patterns. Handle errors.**

