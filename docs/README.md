# Documentation Hub

Welcome to the Airbnb Cleaning Management Platform documentation. This documentation follows arc42 and C4 Model principles for clear, comprehensive technical architecture.

## Quick Start

**New to the project?** → Start with [01-introduction/overview.md](./01-introduction/overview.md)
**Setting up development?** → Read [01-introduction/getting-started.md](./01-introduction/getting-started.md)
**AI assistant starting work?** → Read [08-ai-context/ai-README.md](./08-ai-context/ai-README.md)

## Documentation Structure

```
docs/
├── 01-introduction/          # Project overview, getting started, quality standards
├── 02-architecture/          # arc42 sections, C4 diagrams
│   ├── 01-requirements.md   # Business rules, constraints, stakeholders
│   ├── 02-context-boundary.md
│   ├── 03-solution-strategy.md
│   ├── 04-building-blocks.md
│   ├── 05-runtime-view.md
│   ├── 06-deployment.md
│   ├── 07-crosscutting-concepts.md
│   └── diagrams/            # C4 Model diagrams (Levels 1-3)
├── 03-development/          # Setup, workflows, commands, troubleshooting
├── 04-codebase/            # Manifests (components, services, screens, types)
├── 05-features/            # Feature specifications
├── 06-patterns/            # Reusable code patterns
├── 07-project-management/  # Phase tracking, roadmap, changelog
├── 08-ai-context/          # AI-specific guidance
└── business/               # Business documentation (separate)
```

## Documentation by Role

### For Developers

**Getting Started**:
1. [Getting Started](./01-introduction/getting-started.md) - Setup and installation
2. [Quality Standards](./01-introduction/quality-standards.md) - Code quality requirements
3. [Solution Strategy](./02-architecture/03-solution-strategy.md) - Technology choices

**Architecture**:
1. [Requirements](./02-architecture/01-requirements.md) - Business rules and constraints
2. [C4 Diagrams](./02-architecture/diagrams/) - System context, containers, components
3. [Runtime View](./02-architecture/05-runtime-view.md) - Critical data flows
4. [Crosscutting Concepts](./02-architecture/07-crosscutting-concepts.md) - Design patterns

**Development**:
1. [Workflows](./03-development/workflows.md) - Feature development process
2. [Commands](./03-development/commands.md) - npm scripts and debugging
3. [Conventions](./03-development/conventions.md) - Project-specific patterns
4. [Troubleshooting](./03-development/troubleshooting.md) - Common issues

**Code Reference**:
1. [Components](./04-codebase/components.md) - All 18 UI components
2. [Services](./04-codebase/services.md) - All 8 services
3. [Screens](./04-codebase/screens.md) - All 13 screens
4. [Types](./04-codebase/types.md) - TypeScript interfaces
5. [Database](./04-codebase/database.md) - Supabase schema

**Patterns**:
1. [Component Patterns](./06-patterns/component-patterns.md) - React component templates
2. [Service Patterns](./06-patterns/service-patterns.md) - Service layer templates
3. [Integration Patterns](./06-patterns/integration-patterns.md) - Cross-component communication
4. [Testing Patterns](./06-patterns/testing-patterns.md) - Manual testing checklists

### For AI Assistants

**Start Here**:
1. [AI README](./08-ai-context/ai-README.md) - 30-second project context
2. [Startup Checklist](./08-ai-context/startup-checklist.md) - Mandatory reads before coding
3. [Prompting Guide](./08-ai-context/prompting-guide.md) - How to communicate effectively

**Before Every Task**:
1. Read [AI README](./08-ai-context/ai-README.md) (30 seconds)
2. Check [Phase Status](./07-project-management/phase-status.md) (current priority)
3. Review relevant [Feature Spec](./05-features/) (exact requirements)
4. Check [Manifests](./04-codebase/) (what exists)
5. Follow [Quality Standards](./01-introduction/quality-standards.md)

### For Project Managers

**Project Status**:
1. [Phase Status](./07-project-management/phase-status.md) - Current development phase
2. [Phase History](./07-project-management/phase-history.md) - Completed work
3. [Roadmap](./07-project-management/roadmap.md) - Future phases
4. [Issue Tracking](./07-project-management/issue-tracking.md) - GitHub workflow

**Business Context**:
1. [Business Documentation](./business/) - Executive summaries, metrics
2. [Requirements](./02-architecture/01-requirements.md) - Business rules and constraints
3. [Features](./05-features/) - Feature specifications

## Quick Navigation

### "I need to understand the project"
1. Start: [Overview](./01-introduction/overview.md) (30 seconds)
2. Then: [Requirements](./02-architecture/01-requirements.md) (business context)
3. Then: [Solution Strategy](./02-architecture/03-solution-strategy.md) (technical choices)

### "I want to build a feature"
1. Check: [Phase Status](./07-project-management/phase-status.md) (current priority)
2. Read: [Workflows](./03-development/workflows.md) (process)
3. Reference: [Manifests](./04-codebase/) (what exists)
4. Follow: [Quality Standards](./01-introduction/quality-standards.md) (code standards)

### "I need to fix a bug"
1. Read: [Troubleshooting](./03-development/troubleshooting.md) (common issues)
2. Follow: [Bug Fixing Workflow](./03-development/workflows.md#bug-fixing) (process)
3. Check: [Patterns](./06-patterns/) (correct patterns)

### "I want to know what exists"
1. Components: [Components Manifest](./04-codebase/components.md)
2. Services: [Services Manifest](./04-codebase/services.md)
3. Screens: [Screens Manifest](./04-codebase/screens.md)
4. Types: [Types Manifest](./04-codebase/types.md)

### "I don't know how to ask the AI"
→ [Prompting Guide](./08-ai-context/prompting-guide.md)

### "Something is broken"
→ [Troubleshooting](./03-development/troubleshooting.md)

## Documentation Philosophy

This documentation follows these principles:

### 1. arc42 Structure
Technical architecture documentation following arc42 template:
- Requirements and constraints
- Context and boundaries
- Solution strategy
- Building blocks
- Runtime views
- Deployment
- Crosscutting concepts

### 2. C4 Model Diagrams
Visual system understanding through 3 levels:
- **Level 1**: System Context (actors, system, external systems)
- **Level 2**: Container View (frontend, services, backend)
- **Level 3**: Component View (component relationships)

### 3. Single Source of Truth
Each concept documented in exactly one place:
- No duplicate information
- Clear cross-references
- Easy to maintain

### 4. AI-Optimized
Documentation structured for AI comprehension:
- Clear hierarchy
- Explicit navigation paths
- Consistent formatting
- Quick reference sections

### 5. Living Documentation
Documentation evolves with the codebase:
- Updated with each feature
- Reflects current state
- Includes examples and patterns

## Documentation Statistics

**Total Files**: ~35 (reduced from 69)
**Total Folders**: 8 organized categories
**Components Documented**: 18
**Services Documented**: 8
**Screens Documented**: 13
**Feature Specs**: 5
**C4 Diagrams**: 3 levels
**Last Updated**: January 2025

## Maintenance

### When to Update

**After Adding Component**:
- Update [Components Manifest](./04-codebase/components.md)
- Run `npm run docs:update` to verify

**After Adding Service**:
- Update [Services Manifest](./04-codebase/services.md)
- Document methods with examples

**After Completing Issue**:
- Update [Phase Status](./07-project-management/phase-status.md)
- Update [Phase History](./07-project-management/phase-history.md)

**After New Feature**:
- Create spec in [Features](./05-features/)
- Update relevant manifests
- Update [Changelog](./07-project-management/changelog.md)

### Automated Scripts

```bash
# Validate documentation structure
npm run docs:validate

# Generate manifest report
npm run docs:update

# Update phase status
npm run docs:status
```

## Success Criteria

This documentation system succeeds when:
1. ✅ AI assistants find all context in docs/ directory
2. ✅ New developers onboard in < 30 minutes
3. ✅ No need to search multiple files for information
4. ✅ Manifests provide complete inventories
5. ✅ Business rules are clear and enforceable
6. ✅ Development workflows are repeatable
7. ✅ Phase tracking shows live progress
8. ✅ Automation scripts keep docs current

## Contributing

When adding to documentation:

1. **Choose the right location** based on content type
2. **Follow existing patterns** and formatting
3. **Cross-reference** related documentation
4. **Update manifests** when adding code
5. **Run validation** scripts before committing

## Questions?

- **Technical questions**: Check [Troubleshooting](./03-development/troubleshooting.md)
- **Architecture questions**: Check [C4 Diagrams](./02-architecture/diagrams/)
- **Process questions**: Check [Workflows](./03-development/workflows.md)
- **Business questions**: Check [Business Documentation](./business/)

---

**Remember**: Start with [Overview](./01-introduction/overview.md), then navigate to relevant sections based on your needs.

**Maintained By**: Project team and AI assistants
**Last Updated**: January 2025
