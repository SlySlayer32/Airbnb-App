# Complete Documentation Map for AI Agents

## 📚 Documentation Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  ENTRY POINTS - Start Here                                  │
├─────────────────────────────────────────────────────────────┤
│  1. .cursor/STARTUP.md           → What to read first       │
│  2. docs/AI-README.md            → 30-second overview        │
│  3. .cursorrules                 → Master project rules      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CURSOR RULES (.cursor/rules/) - Focused Guidance           │
├─────────────────────────────────────────────────────────────┤
│  project-rules.mdc (12KB)    → Core project overview        │
│  architecture.mdc (6KB)      → System design & data flows   │
│  workflows.mdc (7KB)         → Commands & debugging         │
│  integrations.mdc (8KB)      → Cross-component patterns     │
│  conventions.mdc (10KB)      → Project-specific patterns    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CORE CONTEXT (docs/core/) - Business & Tech Foundation     │
├─────────────────────────────────────────────────────────────┤
│  PRODUCT.md             → What we're building & why          │
│  BUSINESS_RULES.md      → 5 critical rules (ALWAYS enforce) │
│  USER_ROLES.md          → Permission matrices               │
│  TECH_STACK.md          → Technology choices                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CODE INVENTORY (docs/manifests/) - What Exists             │
├─────────────────────────────────────────────────────────────┤
│  COMPONENTS.md          → 18 UI components with examples    │
│  SERVICES.md            → 8 services with API reference     │
│  SCREENS.md             → 13 screens with routes            │
│  TYPES.md               → TypeScript patterns               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  QUICK REFERENCE (docs/reference/) - Patterns & Templates   │
├─────────────────────────────────────────────────────────────┤
│  QUICK_REFERENCE.md     → Common commands & imports         │
│  API_PATTERNS.md        → Code templates                    │
│  TROUBLESHOOTING.md     → Common errors                     │
│  PROMPTING_GUIDE.md     → How to ask for features           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  WORKFLOWS (docs/workflows/) - Processes                    │
├─────────────────────────────────────────────────────────────┤
│  FEATURE_DEVELOPMENT.md → Step-by-step process             │
│  BUG_FIXING.md          → Debugging approach                │
│  GITHUB_WORKFLOW.md     → Git operations                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CURRENT STATUS (docs/phase-tracking/) - What's Next       │
├─────────────────────────────────────────────────────────────┤
│  PHASE_STATUS.md        → Current priority                  │
│  ISSUE_AUDIT.md         → Quality history                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FEATURE SPECS (docs/features/) - Detailed Requirements    │
├─────────────────────────────────────────────────────────────┤
│  cleaner-dashboard.md   → Cleaner main screen              │
│  session-lifecycle.md   → Cleaning workflow                │
│  photo-proof.md         → Photo validation                 │
│  real-time-updates.md   → Live data sync                   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 When to Use What

### Starting New Feature
```
1. .cursor/STARTUP.md        → Mandatory checklist
2. docs/AI-README.md         → Project context
3. docs/phase-tracking/PHASE_STATUS.md → Is this priority?
4. docs/features/[name].md   → Feature requirements
5. docs/manifests/           → What exists already?
6. .cursor/rules/            → How to implement
```

### Debugging Issue
```
1. .cursor/rules/workflows.mdc → Common fixes
2. docs/reference/TROUBLESHOOTING.md → Known issues
3. docs/reference/API_PATTERNS.md → Correct patterns
```

### Understanding Architecture
```
1. .cursor/rules/architecture.mdc → System design
2. .cursor/rules/integrations.mdc → How components communicate
3. docs/core/TECH_STACK.md → Tech choices
```

### Learning Code Patterns
```
1. .cursor/rules/conventions.mdc → Project-specific patterns
2. docs/manifests/ → Examples of existing code
3. docs/reference/API_PATTERNS.md → Templates
```

### Understanding Business Logic
```
1. docs/core/BUSINESS_RULES.md → 5 critical rules
2. docs/core/USER_ROLES.md → Permission matrices
3. docs/features/ → Detailed specs
```

## 📊 Documentation Statistics

### By Category
```
Entry Points:        3 files  (STARTUP.md, AI-README.md, .cursorrules)
Cursor Rules:        5 files  (43KB total - focused guidance)
Core Context:        4 files  (business & tech foundation)
Code Inventory:      4 files  (manifests - what exists)
Quick Reference:     4 files  (patterns & templates)
Workflows:           3 files  (processes)
Phase Tracking:      2+ files (current status)
Feature Specs:       5+ files (detailed requirements)
Total Documentation: 30+ files covering all aspects
```

### By Size
```
Largest:  project-rules.mdc (12KB)
         conventions.mdc (10KB)
         integrations.mdc (8KB)
Average:  ~6KB per rule file
Total:    43KB of focused AI guidance in .cursor/rules/
```

## 🔄 Information Flow

```
User Request
    ↓
STARTUP.md (mandatory checklist)
    ↓
AI-README.md (30-second context)
    ↓
.cursor/rules/ (how to implement)
    ↓
docs/manifests/ (what exists)
    ↓
docs/core/ (business context)
    ↓
docs/features/ (detailed specs)
    ↓
Implementation
    ↓
docs/workflows/ (testing & validation)
```

## 🎨 Visual Structure

```
Airbnb-App/
├── .cursorrules (13KB)           ← Root level (auto-loaded)
├── CURSOR_RULES_SUMMARY.md       ← Analysis summary
│
├── .cursor/
│   ├── README.md                 ← Setup guide
│   ├── STARTUP.md                ← Mandatory checklist
│   ├── USER_RULES.md             ← Communication style
│   ├── VALIDATION_GUIDE.md       ← Testing guide
│   └── rules/                    ← Modular focused rules
│       ├── project-rules.mdc     ← Core overview
│       ├── architecture.mdc      ← System design
│       ├── workflows.mdc         ← Commands & debugging
│       ├── integrations.mdc      ← Communication patterns
│       └── conventions.mdc       ← Project patterns
│
├── docs/                         ← Comprehensive documentation
│   ├── AI-README.md              ← Entry point
│   ├── core/                     ← Business & tech foundation
│   ├── manifests/                ← Code inventory
│   ├── reference/                ← Patterns & templates
│   ├── workflows/                ← Processes
│   ├── phase-tracking/           ← Current status
│   └── features/                 ← Detailed specs
│
└── .github/
    └── instructions/             ← GitHub Copilot (11 files)
```

## 🚀 Quick Reference Card

### For AI Agents
```
Before ANY work:
  1. Read .cursor/STARTUP.md
  2. Read docs/AI-README.md
  3. Check docs/phase-tracking/PHASE_STATUS.md

Building feature:
  → .cursor/rules/conventions.mdc (how we do things)
  → docs/manifests/ (what exists)
  → docs/features/[name].md (requirements)

Understanding system:
  → .cursor/rules/architecture.mdc (big picture)
  → .cursor/rules/integrations.mdc (communication)

Debugging:
  → .cursor/rules/workflows.mdc (commands)
  → docs/reference/TROUBLESHOOTING.md (common issues)

Business rules:
  → docs/core/BUSINESS_RULES.md (5 critical rules)
```

### For Developers
```
New to project:
  1. Read docs/AI-README.md (30 sec)
  2. Skim .cursorrules (overview)
  3. Browse docs/manifests/ (what exists)
  4. Run npm start (see it work)

Daily development:
  → npm start (dev server)
  → npm run type-check (verify types)
  → npm run docs:update (sync manifests)

Stuck on something:
  → .cursor/rules/workflows.mdc (troubleshooting)
  → docs/reference/TROUBLESHOOTING.md (common issues)
  → package.json (available commands)
```

## 🎯 Success Indicators

### Well-Documented System
✅ Entry point clear (.cursor/STARTUP.md)
✅ Quick overview available (docs/AI-README.md)
✅ Focused rules exist (.cursor/rules/)
✅ Code inventory updated (docs/manifests/)
✅ Business context documented (docs/core/)
✅ Patterns captured (conventions.mdc)
✅ Integration points mapped (integrations.mdc)
✅ Workflows documented (workflows.mdc)

### AI Productivity
✅ AI reads docs first (documentation-first approach)
✅ AI follows project patterns (not generic standards)
✅ AI provides complete code (no TODOs)
✅ AI enforces business rules automatically
✅ AI knows where to find information
✅ AI suggests next logical steps

### Developer Productivity
✅ New developers onboard in < 1 hour
✅ Common questions answered in docs
✅ Patterns easy to find and follow
✅ Business rules clearly stated
✅ Integration points documented

## 📝 Maintenance

### Keep Documentation Current
- Update manifests: `npm run docs:update`
- Update after new components/services
- Update after pattern changes
- Update after business rule changes

### Review Quarterly
- Are rules still accurate?
- Are patterns still followed?
- Are new patterns emerging?
- Are docs helping or hindering?

### Feedback Loop
- Collect AI behavior issues
- Update rules based on real usage
- Add examples from real code
- Remove outdated guidance

---

**Last Updated**: January 2025  
**Purpose**: Map the complete documentation system for AI and human developers  
**Maintained By**: Project team
