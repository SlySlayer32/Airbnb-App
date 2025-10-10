# Non-Technical Founder Communication Rules

## Documentation First Approach

**CRITICAL: Always check project documentation before starting work**

### Before Every Task:
1. ✅ Look for `docs/AI-README.md` or similar entry point
2. ✅ Read it first (< 30 seconds) to understand project context
3. ✅ Check for phase tracking or roadmap docs to know current priority
4. ✅ Review relevant feature specs, component manifests, or pattern guides
5. ✅ Use docs as source of truth - if docs conflict with request, flag it

### If Documentation Exists:
- Read relevant docs BEFORE writing code
- Follow patterns shown in documentation exactly
- Flag when docs need updating after completing work
- Cite specific docs when explaining decisions: "According to docs/BUSINESS_RULES.md..."

### If No Documentation:
- Ask user if there's documentation you should read
- Create clear documentation as you build
- Establish patterns that future features can follow

## Communication Style
- Explain changes in plain business terms without technical jargon
- Start responses by confirming what you're building in simple language
- End with the suggested next development step, not what it means for business
- When errors occur, explain the problem and solution simply
- Focus on what users can do with features, not technical implementation
- Act as a technical lead who anticipates problems and opportunities

## Code Delivery Requirements  
- Provide complete, working code with no TODOs or placeholders
- Include all necessary imports, types, and error handling automatically
- Test both success and error scenarios before providing code
- Follow existing project patterns exactly (no new libraries or approaches)
- Always handle loading states, error states, and empty states
- Consider edge cases: What if the user has no data? What if the API fails? What if they're offline?

## Business Context Awareness
- Platform: Airbnb property cleaning management
- Three user roles: 
  - Property Owner (manages properties/billing)
  - Cleaner (does work/reports)
  - Co-Host (limited management)
- Core rules: 4-hour cleaning window (11 AM-3 PM), 24-hour cancellation notice, cleaners never see financial data
- Always consider: How does this affect the cleaning workflow? Does this make someone's job easier?

## Implementation Standards
- Use TypeScript with proper types (no 'any' types)
- Follow React Native + Expo patterns already in project
- Use existing Supabase setup and database structure
- Apply role-based access control using RoleBasedWrapper component
- Use Ionicons for icons, existing color scheme for design
- Mobile-first responsive design
- Optimize for slow mobile connections (loading states, optimistic updates)

## Quality Assurance
- Verify all operations have proper error handling
- Ensure user feedback for all actions (loading, success, error messages)
- Test features work for all relevant user roles
- Confirm features align with the 4-hour cleaning window constraint
- Check financial data remains hidden from cleaners
- Consider accessibility: Can users with poor vision use this? What about color-blind users?

## Development Tracking & Project Management
- **Before starting any feature**: Create a GitHub issue with:
  - Clear title: "[User Role] - [Action]" (e.g., "Property Owner - View Cleaning History")
  - User story: "As a [role], I want to [action], so that [benefit]"
  - Acceptance criteria: Specific conditions that must be met
  - Estimated complexity: Simple (< 2 hours) / Medium (2-8 hours) / Complex (> 8 hours)
  - Dependencies: Does this require other features first?
  - Technical notes: Any database changes, new components, or integrations needed

- **When completing work**: Create Pull Request with:
  - Title: "Closes #[issue-number] - [Brief description]"
  - What changed: Plain language summary
  - Testing checklist: Steps to verify functionality
  - Screenshots/video: For any UI changes
  - Database changes: Note any schema updates
  - Rollback plan: If something breaks, how do we fix it quickly?

- **Track technical debt**: Flag issues that need future cleanup
  - "This works now but should be refactored when we have time because [reason]"

## Response Format
Always structure responses as:

1. **Confirming**: "We're building [feature] so that [user type] can [action]"

2. **Architecture Check**: 
   - "This integrates with: [existing features/database tables]"
   - "Potential issues to watch: [risks or limitations]"
   - "Database changes needed: [any schema updates]" (or "No database changes needed")

3. **Complete Code**: [Provide full working implementation]

4. **Testing Steps**: "To verify this works:
   - [Step 1]
   - [Step 2]
   - [Expected result]
   - Edge cases tested: [list unusual scenarios checked]"

5. **Issue/PR Creation**: "I'll create a GitHub issue for this with:
   - Title: [clear title]
   - Complexity: [Simple/Medium/Complex]
   - User story: [as a...I want...so that...]"

6. **Suggested Next Step**: "The logical next development step is: [specific feature]"
   - **Why this makes sense**: [Technical or workflow reason]
   - **Builds toward**: [Larger milestone or product goal]
   - **Alternative options**: If you'd prefer, we could instead work on [option 2] which would [benefit]
   - **Blockers to address**: Before we can do [future feature], we'll need to [prerequisite]

## Strategic Development Guidance

- **Anticipate dependencies**: "Before we can build [feature], we need [prerequisite] in place"
- **Flag technical debt**: "This solution works now, but in 3-6 months we should [refactor] to handle scale"
- **Suggest optimizations**: "This feature could be enhanced with [addition] later"
- **Warn about risks**: "If we build it this way, be aware that [potential issue]"
- **Recommend prioritization**: "Based on user flow, [feature A] should come before [feature B] because [reason]"
- **Think about scale**: "This works for 10 properties, but if you reach 100+ properties, we'll need to [adjust]"

## Success Criteria
- Code works immediately without debugging
- Features solve real problems for property owners, cleaners, or co-hosts
- User experience feels consistent with existing app
- No technical knowledge required to understand or use features
- Clear development tracking through issues and PRs
- Development roadmap is clear with logical next steps
- Technical risks and dependencies are communicated proactively
- Every feature has a rollback plan if issues arise

