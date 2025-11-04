# Claude Code Skills

Skills are modular knowledge bases that provide specialized guidelines, patterns, and best practices for specific development tasks. They solve the problem of maintaining consistency and quality across complex codebases.

## What Are Skills?

Skills are structured documentation that Claude Code can activate contextually to provide:
- Development patterns and best practices
- Code examples and templates
- Architectural guidelines
- Domain-specific knowledge

## Current Skills

### frontend-dev-guidelines
**Focus**: Modern React/TypeScript development

**Covers:**
- Component structure and patterns
- TypeScript best practices
- Project organization
- Styling with Tailwind CSS
- Performance optimization
- Accessibility considerations

**Triggers:**
- Keywords: component, react, tsx, typescript, frontend, ui, hook, state
- File patterns: `src/**/*.tsx`, `src/components/**/*`

## Skill Structure

Each skill follows this pattern:
```
skills/
└── skill-name/
    ├── SKILL.md              # Main skill file (<500 lines)
    └── resources/            # Optional detailed guides
        ├── topic-1.md
        └── topic-2.md
```

### Progressive Disclosure
Skills use the "500-line rule":
- Main SKILL.md stays under 500 lines (overview + navigation)
- Detailed topics split into separate resource files
- Claude loads resources incrementally as needed

This prevents context window exhaustion while maintaining depth.

## Auto-Activation System

Skills activate automatically through the `skill-activation-prompt` hook:

1. User types prompt or opens file
2. Hook analyzes context against `skill-rules.json`
3. Matching skills suggested with priority levels
4. User activates skill with Skill tool (or Claude auto-activates)

### skill-rules.json

This configuration file defines activation triggers:

```json
{
  "version": "1.0",
  "skills": {
    "skill-name": {
      "type": "skill",
      "prompt_triggers": {
        "keywords": ["word1", "word2"],
        "intent_patterns": ["regex.*pattern"]
      },
      "file_patterns": {
        "paths": ["src/**/*.tsx"],
        "content_patterns": ["React\\.FC"]
      },
      "enforcement": "suggest",
      "priority": "high"
    }
  }
}
```

**Enforcement levels:**
- `suggest`: Recommended (💡)
- `warn`: Important (⚠️)
- `block`: Required (🚫)

**Priority levels:**
- `critical`: Must address immediately
- `high`: Strongly recommended
- `medium`: Helpful suggestion
- `low`: Optional enhancement

## Creating New Skills

### 1. Create Skill Directory
```bash
mkdir -p .claude/skills/your-skill-name/resources
```

### 2. Write SKILL.md

```markdown
# Your Skill Name

## Purpose
Brief description of what this skill provides

## When to Use This Skill
- Specific scenarios
- Types of tasks

## Guidelines
Core patterns and practices

## Examples
Code examples and templates

## Checklist
- [ ] Key items to verify
```

### 3. Add to skill-rules.json

```json
{
  "skills": {
    "your-skill-name": {
      "type": "skill",
      "prompt_triggers": {
        "keywords": ["relevant", "keywords"],
        "intent_patterns": ["create.*something"]
      },
      "enforcement": "suggest",
      "priority": "high"
    }
  }
}
```

### 4. Test Activation

Try prompts with your trigger keywords:
```
You: "Create a new [keyword] component"
```

Skill should be suggested automatically.

## Skill Templates

### Backend Development Skill
Focus areas:
- API design patterns
- Database interactions
- Error handling
- Authentication/authorization
- Testing strategies

### Route Testing Skill
Focus areas:
- API endpoint testing
- Authentication flows
- Request/response validation
- Test data management

### Error Tracking Skill
Focus areas:
- Sentry integration
- Error boundaries
- Logging strategies
- Error recovery patterns

## Best Practices

### Writing Skills

1. **Keep focused**: One domain per skill
2. **Be specific**: Provide concrete examples
3. **Stay concise**: Main file under 500 lines
4. **Use checklists**: Make guidelines actionable
5. **Include examples**: Show, don't just tell

### Organizing Content

```markdown
# Skill Name

## Purpose (2-3 sentences)

## When to Use (bullet list)

## Core Principles (3-5 key points)

## Patterns (with code examples)

## Common Pitfalls (what to avoid)

## Checklist (actionable items)

## Related Resources (links)
```

### Trigger Configuration

**Keywords:**
- Use lowercase
- Include synonyms
- Cover domain terminology
- Add common misspellings if relevant

**Intent Patterns:**
- Use regex for complex matching
- Capture action + object patterns
- Test thoroughly

**File Patterns:**
- Match your project structure
- Use glob patterns
- Include relevant file types

## Activation Examples

### Keyword Trigger
```
You: "Let's add a new React component for the dashboard"
Output:
=== Skill Activation Detected ===
HIGH Priority:
  💡 SUGGESTED: frontend-dev-guidelines
     Matched: keyword: "component"
```

### Intent Pattern Trigger
```
You: "Create a button that submits the form"
Output:
=== Skill Activation Detected ===
HIGH Priority:
  💡 SUGGESTED: frontend-dev-guidelines
     Matched: pattern: create.*component
```

### File Pattern Trigger
When editing `src/components/NewButton.tsx`, the skill activates based on file path matching.

## Advanced Features

### Resource Files
For large skills, split topics:
```
skills/backend-dev-guidelines/
├── SKILL.md                    # Overview + navigation
└── resources/
    ├── routing-patterns.md     # Detailed routing guide
    ├── database-patterns.md    # Database best practices
    └── testing-patterns.md     # Testing strategies
```

Reference from main SKILL.md:
```markdown
For detailed routing patterns, see resources/routing-patterns.md
```

### Conditional Activation
Use content patterns to activate only when specific code is present:
```json
"content_patterns": [
  "React\\.FC",
  "useState",
  "useEffect"
]
```

### Multi-Skill Scenarios
Multiple skills can activate simultaneously. Priorities help determine which to apply first.

## Troubleshooting

### Skill Not Activating

**Check skill-rules.json syntax:**
```bash
cat .claude/skills/skill-rules.json | jq .
```

**Test keyword matching:**
- Are your keywords too specific?
- Include variations and synonyms
- Check for typos

**Verify file patterns:**
- Do paths match your actual structure?
- Test glob patterns: `ls src/**/*.tsx`

### Hook Not Running

**Check settings.json:**
- Is UserPromptSubmit hook configured?
- Is path correct?

**Verify hook execution:**
```bash
chmod +x .claude/hooks/*.sh
echo '{"user_prompt":"test component"}' | .claude/hooks/skill-activation-prompt.sh
```

## Available Skills from Showcase

The [infrastructure showcase](https://github.com/diet103/claude-code-infrastructure-showcase) includes:

1. **skill-developer**: Meta-skill for creating/managing skills
2. **backend-dev-guidelines**: Express/Prisma/TypeScript patterns
3. **frontend-dev-guidelines**: React/MUI v7 patterns (basis for our version)
4. **route-tester**: API endpoint testing patterns
5. **error-tracking**: Sentry integration patterns

These can be adapted to your project's needs.

## Metrics and Improvement

Track skill effectiveness:
- Which skills activate most frequently?
- Are activation triggers too broad/narrow?
- Do skills improve code consistency?
- Are there missing domains?

Iterate based on usage patterns.

## Resources

- [Infrastructure Showcase](https://github.com/diet103/claude-code-infrastructure-showcase)
- [Claude Code Skills Guide](https://docs.claude.com/en/docs/claude-code)

## License

Skills are documentation - adapt freely to your needs. Based on MIT-licensed showcase reference.
