# Claude Code Infrastructure

This directory contains the Claude Code infrastructure setup based on the [claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase) reference library.

## Structure

```
.claude/
├── hooks/              # Event-driven automation hooks
│   ├── skill-activation-prompt.sh/ts
│   └── post-tool-use-tracker.sh
├── skills/             # Reusable skill modules
│   ├── frontend-dev-guidelines/
│   └── skill-rules.json
├── agents/             # Specialized task agents (to be added)
└── settings.json       # Hook configuration
```

## Components

### Hooks

Hooks are event-driven scripts that run automatically during Claude Code sessions.

#### skill-activation-prompt (UserPromptSubmit)
- **Purpose**: Analyzes your prompts and file context to suggest relevant skills
- **Triggers**: On every user prompt submission
- **How it works**: Reads `skill-rules.json` and matches keywords/patterns in your prompts
- **Output**: Displays skill activation suggestions with priority levels

#### post-tool-use-tracker (PostToolUse)
- **Purpose**: Tracks file edits and suggests build commands
- **Triggers**: After Edit or Write tool usage
- **How it works**: Logs edited files and detects project type for relevant commands
- **Output**: Maintains session cache of edits and suggested commands

### Skills

Skills are modular knowledge bases that Claude can activate for specialized tasks.

#### frontend-dev-guidelines
- **Purpose**: Modern React/TypeScript development patterns
- **Triggers**: Component work, UI development, styling tasks
- **Coverage**: Component patterns, TypeScript best practices, project structure, performance optimization

### Configuration

#### skill-rules.json
Defines when skills should activate based on:
- **Keywords**: Simple string matching in prompts (e.g., "component", "react", "typescript")
- **Intent patterns**: Regex patterns for complex intent detection (e.g., "create.*component")
- **File patterns**: Path and content patterns for context-aware activation
- **Enforcement**: suggest (recommended), warn (important), block (required)
- **Priority**: critical, high, medium, low

#### settings.json
Configures which hooks run and when:
- Maps hook types to script paths
- Sets timeout values
- Provides descriptions for each hook

## How Auto-Activation Works

1. You type a prompt or open a file
2. `skill-activation-prompt` hook analyzes the context
3. Matches against patterns in `skill-rules.json`
4. Suggests relevant skills with priority indicators
5. You use the Skill tool to activate the suggested skill
6. Claude applies the skill's guidelines to your task

## Usage Examples

### Automatic Skill Suggestion
```
You: "Create a new button component"
Hook Output:
=== Skill Activation Detected ===
HIGH Priority:
  💡 SUGGESTED: frontend-dev-guidelines
     Matched: keyword: "component"
```

### File-Based Activation
When you edit files in `src/components/*.tsx`, the frontend skill may automatically activate based on file patterns.

## Adding New Skills

1. Create skill directory: `.claude/skills/your-skill-name/`
2. Write `SKILL.md` with guidelines and patterns
3. Add entry to `skill-rules.json` with triggers
4. Test by using trigger keywords in prompts

## Customization

### Adjusting Skill Triggers
Edit `.claude/skills/skill-rules.json` to:
- Add/remove keywords
- Modify intent patterns
- Update file path patterns
- Change enforcement levels

### Adding More Hooks
Edit `.claude/settings.json` to add new hooks:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": ".claude/hooks/your-hook.sh",
        "timeout": 5000
      }
    ]
  }
}
```

## Dependencies

The hooks require:
- **Node.js/npx**: For running TypeScript hooks with `tsx`
- **jq**: For JSON parsing in bash scripts (post-tool-use-tracker)

Install dependencies:
```bash
npm install -D tsx
# jq usually pre-installed on most systems
```

## Troubleshooting

### Hooks Not Running
- Check file permissions: `chmod +x .claude/hooks/*.sh`
- Verify settings.json syntax
- Check hook script paths are correct

### Skills Not Activating
- Verify skill-rules.json syntax
- Check keyword/pattern matching
- Ensure file paths in patterns match your project structure

### TypeScript Hook Errors
- Install tsx: `npm install -D tsx`
- Check TypeScript syntax in .ts files
- Review hook execution timeout settings

## Best Practices

1. **Start Simple**: Begin with one skill and essential hooks
2. **Iterate**: Add more skills as you identify patterns
3. **Customize**: Adapt trigger patterns to your project's language
4. **Document**: Keep skill guidelines under 500 lines for context efficiency
5. **Test**: Verify hooks work by using trigger keywords

## Resources

- [Infrastructure Showcase Repository](https://github.com/diet103/claude-code-infrastructure-showcase)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

## License

This infrastructure setup is based on MIT-licensed reference code and is free to use in commercial or personal projects.
