#!/usr/bin/env npx tsx

interface HookInput {
  session_id: string;
  transcript_path: string;
  working_directory: string;
  permission_mode: string;
  user_prompt: string;
}

interface PromptTriggers {
  keywords?: string[];
  intent_patterns?: string[];
}

interface FilePatterns {
  paths?: string[];
  content_patterns?: string[];
}

interface SkillRule {
  type: string;
  prompt_triggers?: PromptTriggers;
  file_patterns?: FilePatterns;
  enforcement?: "suggest" | "block" | "warn";
  priority?: "critical" | "high" | "medium" | "low";
}

interface SkillRules {
  version: string;
  skills: Record<string, SkillRule>;
}

interface MatchedSkill {
  name: string;
  enforcement: string;
  priority: string;
  reason: string;
}

async function main() {
  try {
    // Read input from stdin
    const input = await readStdin();
    const hookInput: HookInput = JSON.parse(input);

    // Load skill rules
    const fs = await import('fs/promises');
    const path = await import('path');
    const rulesPath = path.join(hookInput.working_directory, '.claude/skills/skill-rules.json');

    let skillRules: SkillRules;
    try {
      const rulesContent = await fs.readFile(rulesPath, 'utf-8');
      skillRules = JSON.parse(rulesContent);
    } catch (error) {
      // No skill rules file found - exit gracefully
      process.exit(0);
    }

    // Match skills against the prompt
    const matches = matchSkills(hookInput.user_prompt, skillRules);

    if (matches.length > 0) {
      outputMatches(matches);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error in skill-activation-prompt:', error);
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

function matchSkills(prompt: string, skillRules: SkillRules): MatchedSkill[] {
  const matches: MatchedSkill[] = [];
  const lowerPrompt = prompt.toLowerCase();

  for (const [skillName, rule] of Object.entries(skillRules.skills)) {
    const triggers = rule.prompt_triggers;
    if (!triggers) continue;

    let matched = false;
    let reason = '';

    // Check keywords
    if (triggers.keywords) {
      for (const keyword of triggers.keywords) {
        if (lowerPrompt.includes(keyword.toLowerCase())) {
          matched = true;
          reason = `keyword: "${keyword}"`;
          break;
        }
      }
    }

    // Check intent patterns
    if (!matched && triggers.intent_patterns) {
      for (const pattern of triggers.intent_patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(prompt)) {
          matched = true;
          reason = `pattern: ${pattern}`;
          break;
        }
      }
    }

    if (matched) {
      matches.push({
        name: skillName,
        enforcement: rule.enforcement || 'suggest',
        priority: rule.priority || 'medium',
        reason
      });
    }
  }

  return matches;
}

function outputMatches(matches: MatchedSkill[]) {
  // Group by priority
  const priorities = {
    critical: matches.filter(m => m.priority === 'critical'),
    high: matches.filter(m => m.priority === 'high'),
    medium: matches.filter(m => m.priority === 'medium'),
    low: matches.filter(m => m.priority === 'low')
  };

  console.log('\n=== Skill Activation Detected ===\n');

  for (const [priority, skills] of Object.entries(priorities)) {
    if (skills.length === 0) continue;

    console.log(`${priority.toUpperCase()} Priority:`);
    for (const skill of skills) {
      const action = skill.enforcement === 'block' ? '🚫 REQUIRED' :
                     skill.enforcement === 'warn' ? '⚠️  RECOMMENDED' :
                     '💡 SUGGESTED';
      console.log(`  ${action}: ${skill.name}`);
      console.log(`    Matched: ${skill.reason}`);

      if (skill.enforcement === 'block') {
        console.log(`    ⚠️  Use Skill tool BEFORE responding`);
      }
    }
    console.log('');
  }

  console.log('Use the Skill tool to activate relevant skills.\n');
}

main();
