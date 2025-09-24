---
applyTo: '**/CHANGELOG.md'
---

# Changelog Documentation Standards

## For Every Significant Change

Add an entry to CHANGELOG.md following this format:

```markdown
## [vX.X.X] - YYYY-MM-DD - Brief Description

### 🏠 New Features (if applicable)
- **Feature Name**: Description of feature and business value

### 🐛 Fixed Issues (if applicable)  
- **Issue Description**: How it was resolved and business impact

### 🔧 Technical Improvements (if applicable)
- **Improvement Name**: What changed and why it matters

**Business Impact**: Explain how this change benefits users and the business

**Pull Request/Commit**: Reference to PR or commit hash
```

## Commit Message Format

`[TYPE]: Brief description of what changed and why`

Types:

- FEATURE: New functionality
- FIX: Bug fixes  
- DOCS: Documentation changes
- REFACTOR: Code changes that neither fix bugs nor add features
- PERF: Performance improvements

## Examples

- "FEATURE: Add real-time notifications for cleaning updates"
- "FIX: Resolve linen calculation for large properties"
- "DOCS: Update API documentation for cleaner endpoints"
