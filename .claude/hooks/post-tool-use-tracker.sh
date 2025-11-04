#!/bin/bash

# Post-tool-use tracker hook for Claude Code
# Tracks file edits and provides build command suggestions

# Read input from stdin
read -r input

# Extract tool name and file path using jq
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.parameters.file_path // empty')

# Skip if not an edit tool or no file path
if [[ "$tool_name" != "Edit" && "$tool_name" != "Write" ]] || [[ -z "$file_path" ]]; then
  exit 0
fi

# Skip markdown files
if [[ "$file_path" == *.md ]]; then
  exit 0
fi

# Create cache directory for this session
session_id=$(echo "$input" | jq -r '.session_id // "default"')
cache_dir="/tmp/claude-code-cache/$session_id"
mkdir -p "$cache_dir"

# Log the edited file
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$timestamp] $file_path" >> "$cache_dir/edited-files.log"

# Detect project type and suggest commands
detect_project_type() {
  local dir="$1"

  if [[ -f "$dir/package.json" ]]; then
    # Check if it's a TypeScript project
    if [[ -f "$dir/tsconfig.json" ]]; then
      echo "typescript"
    else
      echo "javascript"
    fi
  fi
}

# Get build commands based on project type
get_commands() {
  local project_type="$1"
  local working_dir="$2"

  case "$project_type" in
    typescript)
      # Check for common TypeScript project setups
      if grep -q '"vite"' "$working_dir/package.json" 2>/dev/null; then
        echo "npm run build"
        echo "npx tsc --noEmit"
      elif grep -q '"next"' "$working_dir/package.json" 2>/dev/null; then
        echo "npm run build"
      else
        echo "npx tsc"
      fi
      ;;
    javascript)
      if grep -q '"build"' "$working_dir/package.json" 2>/dev/null; then
        echo "npm run build"
      fi
      ;;
  esac
}

# Detect project and save commands
working_dir=$(echo "$input" | jq -r '.working_directory // "."')
project_type=$(detect_project_type "$working_dir")

if [[ -n "$project_type" ]]; then
  get_commands "$project_type" "$working_dir" > "$cache_dir/suggested-commands.txt"
fi

# Exit successfully
exit 0
