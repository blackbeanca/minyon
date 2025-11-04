# Claude Code Hooks

Hooks are event-driven scripts that execute automatically during Claude Code sessions. They enable automation, validation, and context-aware suggestions.

## Available Hooks

### skill-activation-prompt
**Type**: UserPromptSubmit
**Files**: `skill-activation-prompt.sh`, `skill-activation-prompt.ts`

Analyzes user prompts and file context to automatically suggest relevant skills.

**How it works:**
1. Receives user prompt via stdin
2. Loads skill rules from `.claude/skills/skill-rules.json`
3. Matches prompt against keyword and regex patterns
4. Outputs prioritized skill suggestions

**Configuration**: Edit `skill-rules.json` to customize triggers

### post-tool-use-tracker
**Type**: PostToolUse
**File**: `post-tool-use-tracker.sh`

Tracks file modifications and suggests relevant build/test commands.

**How it works:**
1. Monitors Edit and Write tool usage
2. Logs edited files to session cache
3. Detects project type (TypeScript, JavaScript, etc.)
4. Generates appropriate build commands

**Session cache location**: `/tmp/claude-code-cache/[session-id]/`

## Hook Types

Claude Code supports these hook types:
- **UserPromptSubmit**: Runs when user submits a prompt
- **PostToolUse**: Runs after tool execution
- **PreToolUse**: Runs before tool execution (not currently used)

## Creating Custom Hooks

### Basic Structure

```bash
#!/bin/bash
# Read input from stdin
read -r input

# Process input (available as JSON)
# - tool_name
# - parameters
# - session_id
# - working_directory

# Perform your logic
# ...

# Exit with status code
exit 0  # Success
```

### TypeScript Hook Example

```typescript
interface HookInput {
  session_id: string;
  user_prompt: string;
  working_directory: string;
}

async function main() {
  const input = await readStdin();
  const hookInput: HookInput = JSON.parse(input);

  // Your logic here

  process.exit(0);
}
```

## Configuration

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": ".claude/hooks/your-hook.sh",
        "timeout": 5000,
        "description": "What your hook does"
      }
    ]
  }
}
```

## Requirements

- **Bash scripts**: Executable permissions (`chmod +x`)
- **TypeScript hooks**: Node.js with npx and tsx
- **JSON parsing**: jq (for bash hooks processing JSON)

## Installation

```bash
# Make hooks executable
chmod +x .claude/hooks/*.sh

# Install TypeScript runner
npm install -D tsx
```

## Debugging

### Enable verbose logging
Add debug output to your hooks:
```bash
echo "DEBUG: Hook triggered" >&2
```

### Check execution
```bash
# Test hook manually
echo '{"user_prompt":"test"}' | .claude/hooks/skill-activation-prompt.sh
```

### Common Issues

**Hook not executing:**
- Check file permissions
- Verify path in settings.json
- Check for syntax errors

**Timeout errors:**
- Increase timeout in settings.json
- Optimize hook execution time
- Check for blocking operations

## Best Practices

1. **Keep hooks fast**: Target <2 seconds execution time
2. **Handle errors gracefully**: Always exit with appropriate status codes
3. **Use absolute paths**: Relative paths may not work in all contexts
4. **Log to stderr**: Use stderr for debug info, stdout for hook output
5. **Test thoroughly**: Run hooks manually before deploying

## Examples from Showcase

The infrastructure showcase includes additional hooks:
- `tsc-check.sh`: TypeScript compilation checks
- `trigger-build-resolver.sh`: Intelligent build command resolution
- `error-handling-reminder`: Reminds about error handling patterns
- `stop-build-check-enhanced`: Pre-stop validation

These can be adapted from the [showcase repository](https://github.com/diet103/claude-code-infrastructure-showcase).

## Security Considerations

- Hooks run with your user permissions
- Validate input before processing
- Avoid executing untrusted code
- Be cautious with file system operations

## Resources

- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code)
- [Infrastructure Showcase](https://github.com/diet103/claude-code-infrastructure-showcase)
