# Project Documentation Index

Use this as your source of truth for where every topic lives. Keep this updated as part of the pre-push checklist.

## 📁 Documentation Structure

All documentation has been organized into logical folders under `/docs/`:

### 🏢 Business Documentation (`/docs/business/`)

- [EXECUTIVE_SUMMARY.md](business/EXECUTIVE_SUMMARY.md) — High-level value, market, roadmap
- [COMPLETE_PRODUCT_ROADMAP.md](business/COMPLETE_PRODUCT_ROADMAP.md) — 12-week plan, finances, KPIs
- [SUCCESS_METRICS_FRAMEWORK.md](business/SUCCESS_METRICS_FRAMEWORK.md) — KPI definitions and targets
- [VISUAL_WORKFLOW_DIAGRAMS.md](business/VISUAL_WORKFLOW_DIAGRAMS.md) — Visuals for decks and demos
- [USER_WORKFLOW_ANALYSIS.md](business/USER_WORKFLOW_ANALYSIS.md) — Personas, workflows, gaps

### 🔧 Technical Documentation (`/docs/technical/`)

- [THIRD_PARTY_INTEGRATIONS.md](technical/THIRD_PARTY_INTEGRATIONS.md) — Integration research and priorities
- [INTERACTIVE_TESTING_RESULTS.md](technical/INTERACTIVE_TESTING_RESULTS.md) — Current app testing status and gaps
- [DEVELOPMENT_HISTORY.md](technical/DEVELOPMENT_HISTORY.md) — Commit-to-business narrative

### 📋 Process Documentation (`/docs/process/`)

- [CONTRIBUTING.md](process/CONTRIBUTING.md) — Developer contribution workflow
- [VERSION.md](process/VERSION.md) — Current semantic version tracking

### 📄 Templates (`/docs/templates/`)

- [GITHUB_ISSUES_TEMPLATE.md](templates/GITHUB_ISSUES_TEMPLATE.md) — Issue templates for organization

## 📂 Root Level Files (Essential Only)

- [README.md](../README.md) — Setup, run, contribute (project overview)
- [CHANGELOG.md](../CHANGELOG.md) — Versioned technical changes
- `.github/instructions/*.instructions.md` — AI development rules and patterns
- `.github/ISSUE_TEMPLATE/` — GitHub issue templates
- `.github/pull_request_template.md` — PR template

## Update Rules (Quick)

- New features: Update CHANGELOG, ROADMAP, USER_WORKFLOW_ANALYSIS, VISUAL_WORKFLOW_DIAGRAMS
- Fixes: Update CHANGELOG, INTERACTIVE_TESTING_RESULTS
- Infra: Update CHANGELOG, EXECUTIVE_SUMMARY (if impactful)
