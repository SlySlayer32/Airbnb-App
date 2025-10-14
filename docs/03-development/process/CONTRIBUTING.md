# Contributing to Airbnb Cleaning Management Platform

Welcome to our project! This guide helps you understand how to contribute effectively to our platform, whether you're an investor, developer, or stakeholder.

## 📋 Documentation Map

**⚡ NEW**: [`/.ai/README.md`](../../.ai/README.md) - **Complete AI-optimized documentation hub** (Start here!)

### For Developers

- **Primary Reference**: [`/.ai/`](../../.ai/) - Complete manifests, workflows, conventions, and guides
  - [README.md](../../.ai/README.md) - Project overview and context
  - [QUICK_REFERENCE.md](../../.ai/QUICK_REFERENCE.md) - Fast lookup for patterns
  - [COMPONENT_MANIFEST.md](../../.ai/COMPONENT_MANIFEST.md) - All 18 components
  - [SERVICE_MANIFEST.md](../../.ai/SERVICE_MANIFEST.md) - All 8 services
  - [SCREEN_MANIFEST.md](../../.ai/SCREEN_MANIFEST.md) - All 13 screens
  - [CONVENTIONS.md](../../.ai/CONVENTIONS.md) - Code patterns & design system
  - [WORKFLOWS.md](../../.ai/WORKFLOWS.md) - Daily development processes
  - [PROMPTING_GUIDE.md](../../.ai/PROMPTING_GUIDE.md) - AI communication templates
  - [GITHUB_WORKFLOW.md](../../.ai/GITHUB_WORKFLOW.md) - Git operations guide
  - [TROUBLESHOOTING.md](../../.ai/TROUBLESHOOTING.md) - Common issues & fixes

### For Investors & Stakeholders

- [`docs/business/EXECUTIVE_SUMMARY.md`](../business/EXECUTIVE_SUMMARY.md) - Market analysis and value proposition
- [`docs/business/FOUNDER_EXECUTIVE_SUMMARY.md`](../business/FOUNDER_EXECUTIVE_SUMMARY.md) - Phase 1 completion summary
- [`docs/archive/`](../archive/) - Historical roadmaps and analysis

### For Project History

- [`docs/technical/DEVELOPMENT_HISTORY.md`](../technical/DEVELOPMENT_HISTORY.md) - Complete project evolution
- [`CHANGELOG.md`](../../CHANGELOG.md) - Technical version history
- [`docs/technical/PHASE_1_COMPLETION_REPORT.md`](../technical/PHASE_1_COMPLETION_REPORT.md) - Phase 1 technical summary

## 🚀 Quick Start for Contributors

### Developers

```bash
# 1. Clone and setup
git clone https://github.com/SlySlayer32/Airbnb-App.git
cd Airbnb-App
npm install

# 2. Create environment file
cp .env.example .env
# Add your Supabase credentials

# 3. Start development
npm start
```

### Non-Technical Contributors

1. **Read the Executive Summary** to understand the business
2. **Review the Product Roadmap** to see where we're heading
3. **Check Current Status** in Interactive Testing Results
4. **Provide Feedback** through GitHub Issues using our templates

## 📝 Making Changes

### Before You Start

1. **Read [`.ai/README.md`](../../.ai/README.md)** for complete project context
2. **Check [`.ai/WORKFLOWS.md`](../../.ai/WORKFLOWS.md)** for development processes
3. **Review [`.ai/CONVENTIONS.md`](../../.ai/CONVENTIONS.md)** for code standards
4. **Review Recent Changes** in CHANGELOG.md

### Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Existing Patterns**
   - Check `.github/instructions/` for component and service patterns
   - Use TypeScript throughout
   - Follow the existing code style

3. **Update Documentation**
   - Update `CHANGELOG.md` with your changes
   - Update relevant roadmap/analysis docs
   - Follow the documentation update rules in `DOCUMENTATION_INDEX.md`

4. **Test Your Changes**

   ```bash
   npm run lint      # Type checking
   npm start         # Manual testing
   ```

5. **Commit with Proper Format**

   ```bash
   git commit -m "FEATURE: Brief description (affects: user_role)

   - Specific change 1
   - Specific change 2
   - Business impact/value

   Docs updated: file1.md, file2.md"
   ```

### Documentation Workflow

When updating docs, use this checklist from `DOCUMENTATION_INDEX.md`:

- **New features**: Update CHANGELOG, ROADMAP, USER_WORKFLOW_ANALYSIS, VISUAL_WORKFLOW_DIAGRAMS
- **Bug fixes**: Update CHANGELOG, INTERACTIVE_TESTING_RESULTS
- **Infrastructure**: Update CHANGELOG, EXECUTIVE_SUMMARY (if impactful)

## 🎯 Pull Request Process

### PR Requirements

1. **Clear Description**: Explain what changed and why
2. **Business Impact**: How does this benefit users?
3. **Documentation Updated**: Which docs were updated?
4. **Testing Completed**: How was this tested?

### PR Template

We provide a PR template that covers:

- Summary of changes
- Business impact
- Documentation updates
- Testing checklist
- AI context recording

### Review Process

1. **Automated Checks**: GitHub Actions will run type checking
2. **Documentation Review**: Ensure all docs are updated
3. **Business Impact**: Validate the change aligns with roadmap
4. **Code Quality**: Check adherence to existing patterns

## 🐛 Reporting Issues

### Issue Types

We have templates for:

- **🐛 Bug Reports**: Something isn't working
- **💡 Feature Requests**: New functionality ideas
- **📚 Documentation**: Documentation improvements
- **🔧 Technical Debt**: Code quality improvements

### Before Opening an Issue

1. **Check Existing Issues**: Avoid duplicates
2. **Review Current Status**: Check INTERACTIVE_TESTING_RESULTS.md
3. **Use Appropriate Template**: Choose the right issue type

## 🤖 AI Development Partner

This project uses GitHub Copilot as a technical co-founder:

- **Instructions**: See `.github/instructions/` for AI guidance
- **Business Context**: AI understands cleaning workflows and user roles
- **Code Patterns**: AI follows established component and service patterns
- **Natural Language**: Describe features in plain English

### Working with AI

1. **Reference Business Context**: Mention user roles (cleaner, property_owner, co_host)
2. **Use Existing Patterns**: AI knows our component and service structures
3. **Be Specific**: Clear requirements get better implementations
4. **Iterate**: AI can refine and improve based on feedback

## 🏆 Success Criteria

### Code Quality

- [ ] TypeScript compilation passes
- [ ] Follows existing component patterns
- [ ] Includes proper error handling
- [ ] Has role-based access control where needed

### Documentation

- [ ] CHANGELOG.md updated
- [ ] Relevant analysis docs updated
- [ ] AI context preserved in DEVELOPMENT_HISTORY.md
- [ ] Documentation index reflects changes

### Business Value

- [ ] Addresses real user needs
- [ ] Aligns with product roadmap
- [ ] Includes success metrics
- [ ] Has clear business impact

## 📞 Getting Help

### For Developers

- Review existing code patterns in the codebase
- Check AI instructions for guidance
- Look at DEVELOPMENT_HISTORY.md for context on decisions

### For Business Questions

- Start with EXECUTIVE_SUMMARY.md for high-level context
- Check COMPLETE_PRODUCT_ROADMAP.md for strategic direction
- Review USER_WORKFLOW_ANALYSIS.md for user needs

### For Process Questions

- Check DOCUMENTATION_INDEX.md for where things belong
- Review this CONTRIBUTING.md for workflows
- See `.github/instructions/github-workflow.instructions.md` for detailed processes

## 🎉 Recognition

Contributors are recognized in:

- **DEVELOPMENT_HISTORY.md**: Major contributions documented
- **CHANGELOG.md**: Technical contributions listed
- **GitHub Contributors**: Automatic recognition

---

## Version

This contributing guide was last updated for **v1.3.0** of the platform.

Thank you for contributing to the future of property management technology! 🏠✨
