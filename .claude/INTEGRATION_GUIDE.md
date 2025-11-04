# Claude Code Infrastructure - Integration Guide

This guide helps you get started with the Claude Code infrastructure installed in this project, based on the [claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase).

## What's Been Set Up

### ✅ Directory Structure
```
.claude/
├── hooks/              # Event-driven automation
│   ├── skill-activation-prompt.sh/ts
│   ├── post-tool-use-tracker.sh
│   └── README.md
├── skills/             # Development guidelines
│   ├── frontend-dev-guidelines/
│   ├── skill-rules.json
│   └── README.md
├── agents/             # Task automation (ready for use)
│   └── README.md
├── settings.json       # Hook configuration
├── README.md          # Main documentation
└── INTEGRATION_GUIDE.md (this file)
```

### ✅ Active Hooks

**skill-activation-prompt** (UserPromptSubmit)
- Suggests relevant skills based on your prompts
- Analyzes file context automatically
- Matches against skill-rules.json

**post-tool-use-tracker** (PostToolUse)
- Tracks file modifications
- Suggests build commands
- Maintains session cache

### ✅ Available Skills

**frontend-dev-guidelines**
- React/TypeScript patterns
- Component best practices
- Project structure guidelines
- Performance optimization
- Accessibility standards

## Quick Start (5 Minutes)

### 1. Install Dependencies

The hooks require Node.js and tsx:
```bash
npm install -D tsx
```

Verify jq is installed (usually pre-installed):
```bash
which jq || sudo apt-get install jq  # Linux
which jq || brew install jq          # macOS
```

### 2. Make Hooks Executable

```bash
chmod +x .claude/hooks/*.sh
```

### 3. Test the Setup

Try a prompt with skill triggers:
```
You: "Create a new React component for the user profile"
```

You should see skill activation output suggesting the frontend-dev-guidelines skill.

### 4. Activate a Skill

When prompted, use the Skill tool:
```
You: "Use the frontend-dev-guidelines skill"
```

Claude will load the skill and apply its guidelines to your task.

## How Auto-Activation Works

### The Flow

1. **You submit a prompt** → "Let's add a new button component"
2. **UserPromptSubmit hook fires** → skill-activation-prompt.sh runs
3. **Pattern matching occurs** → Checks skill-rules.json
4. **Match found** → Keywords: "component", "button"
5. **Skill suggested** → frontend-dev-guidelines (HIGH priority)
6. **You activate** → Use Skill tool or Claude auto-activates
7. **Guidelines applied** → Development follows best practices

### Example Session

```
You: I need to create a dashboard component with metrics

[Skill Activation Detected]
HIGH Priority:
  💡 SUGGESTED: frontend-dev-guidelines
     Matched: keyword "component"

Use the Skill tool to activate relevant skills.

Claude: I see you're creating a component. Let me activate the
frontend-dev-guidelines to ensure we follow best practices...

[Loads skill and applies patterns]

I'll create the dashboard component following our established patterns:
- TypeScript with explicit prop types
- Tailwind CSS for styling
- Responsive design
- Performance optimization with React.memo
...
```

## Customizing for Your Project

### Adjust Skill Triggers

Edit `.claude/skills/skill-rules.json`:

```json
{
  "skills": {
    "frontend-dev-guidelines": {
      "prompt_triggers": {
        "keywords": [
          "component",
          "react",
          // Add your project-specific terms
          "dashboard",
          "metrics",
          "widget"
        ],
        "intent_patterns": [
          "create.*component",
          "build.*ui",
          // Add patterns for your domain
          "implement.*metric",
          "add.*visualization"
        ]
      },
      "file_patterns": {
        "paths": [
          "src/components/**/*.tsx",
          // Add your specific paths
          "src/features/**/*.tsx",
          "src/widgets/**/*.tsx"
        ]
      }
    }
  }
}
```

### Modify Skill Guidelines

Edit `.claude/skills/frontend-dev-guidelines/SKILL.md`:

1. Add project-specific patterns
2. Include your component library (if not Tailwind)
3. Add team conventions
4. Update file structure to match your project

### Add New Skills

For backend, testing, or other domains:

```bash
# Create skill directory
mkdir -p .claude/skills/backend-dev-guidelines

# Write SKILL.md with your patterns
nano .claude/skills/backend-dev-guidelines/SKILL.md

# Add to skill-rules.json
# Edit .claude/skills/skill-rules.json to add activation rules
```

## Project-Specific Customizations

### For Your React/Vite Project

The frontend skill is already tailored for:
- ✅ React 18+ with functional components
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Vite build system

Update these sections in SKILL.md if you use different tools:
- Component patterns (if using different state management)
- Styling guidelines (if not using Tailwind)
- Build commands (if not using Vite)

### File Structure Alignment

Current project structure:
```
src/
├── components/
│   ├── dashboard/
│   ├── hero/
│   └── journeys/
└── main.tsx
```

The skill's file pattern matches this. If you restructure, update `skill-rules.json`:
```json
"file_patterns": {
  "paths": [
    "src/components/**/*.tsx",
    "src/your-new-dir/**/*.tsx"
  ]
}
```

## Verification Checklist

After setup, verify:

- [ ] Hooks are executable: `ls -la .claude/hooks/*.sh`
- [ ] tsx is installed: `npx tsx --version`
- [ ] jq is available: `which jq`
- [ ] settings.json syntax is valid: `cat .claude/settings.json | jq .`
- [ ] skill-rules.json syntax is valid: `cat .claude/skills/skill-rules.json | jq .`
- [ ] Test activation: Try prompts with "component", "react", etc.
- [ ] Skill loads: Use Skill tool to activate frontend-dev-guidelines

## Troubleshooting

### Hooks Not Running

**Symptom**: No skill activation messages appear

**Solutions:**
1. Check permissions: `chmod +x .claude/hooks/*.sh`
2. Verify settings.json: `cat .claude/settings.json | jq .`
3. Check hook paths in settings.json are correct
4. Look for errors in Claude Code console

### Skills Not Activating

**Symptom**: Skill activation message doesn't appear for relevant prompts

**Solutions:**
1. Check skill-rules.json syntax: `cat .claude/skills/skill-rules.json | jq .`
2. Verify keywords match your prompts (case-insensitive)
3. Test intent patterns with regex tester
4. Check file patterns match your structure

### TypeScript Hook Errors

**Symptom**: Hook fails with TypeScript errors

**Solutions:**
1. Install tsx: `npm install -D tsx`
2. Check Node version: `node --version` (should be 16+)
3. Review .ts file syntax
4. Check stdin reading logic

### Skill Not Loading

**Symptom**: Skill tool doesn't find the skill

**Solutions:**
1. Verify SKILL.md exists in correct location
2. Check file permissions
3. Ensure skill name matches directory name
4. Review skill file format

## Advanced Usage

### Multiple Skills

When multiple skills apply:
```json
{
  "skills": {
    "frontend-dev-guidelines": { "priority": "high" },
    "testing-guidelines": { "priority": "medium" },
    "accessibility-guidelines": { "priority": "high" }
  }
}
```

Priorities help Claude choose which to apply first.

### Blocking Skills

For critical guidelines:
```json
{
  "frontend-dev-guidelines": {
    "enforcement": "block",
    "priority": "critical"
  }
}
```

This requires skill activation before proceeding.

### Conditional Activation

Activate based on file content:
```json
{
  "file_patterns": {
    "content_patterns": [
      "React\\.FC",
      "export.*Component"
    ]
  }
}
```

Only activates when these patterns exist in open files.

## Next Steps

### 1. Add More Skills (Optional)

Consider creating skills for:
- Backend development (if you add API)
- Testing strategies
- Deployment workflows
- Database patterns

### 2. Add Agents (Optional)

Create agents for repetitive tasks:
- Component generation
- Test file creation
- Documentation generation

### 3. Create Project-Specific Resources

Add to frontend skill:
```
.claude/skills/frontend-dev-guidelines/
└── resources/
    ├── component-templates.md
    ├── testing-patterns.md
    └── styling-guide.md
```

### 4. Monitor and Iterate

Track which skills activate most:
- Review session cache: `/tmp/claude-code-cache/`
- Adjust triggers based on usage
- Refine guidelines as patterns emerge

## Best Practices

### Daily Workflow

1. Start working on a feature
2. Skill auto-activates based on context
3. Follow suggested guidelines
4. Iterate and refine

### Code Review

Use skills during review:
- Check against established patterns
- Verify consistency
- Identify deviations

### Onboarding

New team members:
- Skills document team conventions
- Automatic suggestions guide development
- Reduces need for manual code review

## Resources

### Documentation
- [Main README](.claude/README.md) - Overview
- [Hooks README](.claude/hooks/README.md) - Hook details
- [Skills README](.claude/skills/README.md) - Skill creation
- [Agents README](.claude/agents/README.md) - Agent usage

### External
- [Infrastructure Showcase](https://github.com/diet103/claude-code-infrastructure-showcase)
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)

## Support

### Common Questions

**Q: How do I disable a hook temporarily?**
A: Comment out the hook in `.claude/settings.json` or set timeout to 1ms.

**Q: Can I have multiple skills active at once?**
A: Yes, Claude can reference multiple skills simultaneously.

**Q: How do I share this setup with my team?**
A: Commit the `.claude/` directory to your repository. Others will inherit the configuration.

**Q: Do hooks slow down Claude Code?**
A: Minimal impact. Hooks are optimized to run in <2 seconds.

**Q: Can I use this with other AI coding tools?**
A: This infrastructure is Claude Code-specific, but skills (documentation) can be adapted.

## Feedback and Improvements

This infrastructure is meant to evolve with your project. As you discover new patterns:

1. Update skill guidelines
2. Add new activation triggers
3. Create domain-specific skills
4. Share improvements with the team

## License

This setup is based on MIT-licensed reference code from the claude-code-infrastructure-showcase. Use freely in commercial or personal projects.

---

**Ready to start?** Try creating a component and watch the skill activation in action!
