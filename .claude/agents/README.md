# Claude Code Agents

Agents are standalone, specialized assistants for complex multi-step tasks. Unlike skills (which are guidelines), agents are autonomous workers that can be invoked to complete specific jobs.

## What Are Agents?

Agents are self-contained task executors that:
- Run independently with their own context
- Execute multi-step workflows
- Provide structured outputs
- Don't require continuous interaction

## Agent vs Skill

**Skills:**
- Provide guidelines and patterns
- Activated contextually
- Consulted during development
- Guide your coding decisions

**Agents:**
- Execute specific tasks
- Invoked explicitly
- Work autonomously
- Return completed results

## Setting Up Agents

Agents will be added to this directory as standalone command files or agent definitions. Each agent should:

1. Have a clear, single purpose
2. Define its input requirements
3. Specify expected outputs
4. Document usage examples

## Example Agent Types

### Code Review Agent
```bash
# Usage: Review code changes and provide feedback
.claude/agents/code-reviewer.sh --files="src/**/*.tsx"
```

**Purpose:** Automated code review checking for:
- Style consistency
- Best practice adherence
- Security issues
- Performance concerns

### Refactoring Planner
```bash
# Usage: Plan complex refactoring tasks
.claude/agents/refactor-planner.sh --target="src/components"
```

**Purpose:** Analyze code and create refactoring plan:
- Identify patterns
- Suggest improvements
- Outline migration steps
- Risk assessment

### Documentation Generator
```bash
# Usage: Generate documentation from code
.claude/agents/doc-generator.sh --module="features/auth"
```

**Purpose:** Create documentation:
- API documentation
- Component usage guides
- Architecture diagrams
- Code examples

## Available Agents from Showcase

The [infrastructure showcase](https://github.com/diet103/claude-code-infrastructure-showcase/.claude/agents/) includes these agents:

1. **code-architecture-reviewer**: Analyzes architecture decisions
2. **refactor-planner**: Plans large-scale refactoring
3. **documentation-architect**: Creates structured documentation
4. **frontend-error-fixer**: Debugs frontend issues
5. **backend-api-developer**: Implements API endpoints
6. **route-integration-tester**: Tests API routes
7. **sentry-integration-specialist**: Sets up error tracking
8. **prisma-schema-validator**: Validates database schemas
9. **performance-optimizer**: Identifies performance issues
10. **security-auditor**: Security vulnerability scanning

## Creating Custom Agents

### 1. Define Purpose
```markdown
# Agent: Component Generator

**Purpose**: Generate complete React components with tests

**Input**: Component name, props specification

**Output**:
- Component file
- Test file
- Storybook story
- Documentation
```

### 2. Create Agent Script
```bash
#!/bin/bash
# .claude/agents/component-generator.sh

COMPONENT_NAME=$1
PROPS_FILE=$2

# Generate component
# Generate tests
# Generate documentation

echo "Component generated: $COMPONENT_NAME"
```

### 3. Document Usage
```markdown
## Usage

bash
.claude/agents/component-generator.sh ButtonCard props.json


## Example

bash
.claude/agents/component-generator.sh UserProfile '{"name":"string","avatar":"string"}'

```

## Agent Patterns

### Input/Output Structure
```typescript
interface AgentInput {
  task: string;
  context: Record<string, any>;
  options?: Record<string, any>;
}

interface AgentOutput {
  success: boolean;
  result: any;
  steps: string[];
  recommendations?: string[];
}
```

### Error Handling
```bash
set -e  # Exit on error
trap 'echo "Agent failed at line $LINENO"' ERR
```

### Progress Reporting
```bash
echo "Step 1/5: Analyzing code..."
echo "Step 2/5: Identifying patterns..."
# ...
```

## Integration with Skills

Agents can reference skills for guidelines:
```bash
# In agent script
SKILL_PATH=".claude/skills/frontend-dev-guidelines/SKILL.md"
# Apply guidelines from skill during generation
```

## Best Practices

1. **Single Responsibility**: One agent, one job
2. **Clear Inputs**: Document required parameters
3. **Structured Output**: Consistent result format
4. **Error Recovery**: Handle failures gracefully
5. **Documentation**: Usage examples and edge cases
6. **Idempotent**: Safe to run multiple times

## Invocation Methods

### From Command Line
```bash
.claude/agents/your-agent.sh --arg=value
```

### From Claude Code
```
You: "Run the code review agent on the auth module"
Claude: *Uses Task tool with agent script*
```

### Automated (Hooks)
```json
{
  "hooks": {
    "PreCommit": [
      {
        "command": ".claude/agents/code-reviewer.sh"
      }
    ]
  }
}
```

## Coming Soon

This directory is ready for agent definitions. Add agents as you identify repetitive tasks that can be automated.

Consider creating agents for:
- Repetitive code generation
- Complex refactoring workflows
- Testing automation
- Documentation generation
- Code analysis and reporting

## Resources

- [Infrastructure Showcase Agents](https://github.com/diet103/claude-code-infrastructure-showcase/.claude/agents/)
- [Claude Code Agent Guide](https://docs.claude.com/en/docs/claude-code)

## License

Agent definitions are MIT licensed - adapt and extend as needed.
