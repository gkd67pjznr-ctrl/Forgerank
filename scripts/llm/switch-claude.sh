#!/bin/bash
# Switch Claude Code backend to native Anthropic (revert from any backend)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

node -e "
const fs = require('fs');
const path = require('path');

const settingsPath = path.join('$PROJECT_DIR', '.claude', 'settings.local.json');

// Read existing settings
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch(e) {
  console.log('Already using Claude backend.');
  process.exit(0);
}

// Check if any backend override is active
if (!settings.env || !settings.env.ANTHROPIC_BASE_URL) {
  console.log('Already using Claude backend.');
  process.exit(0);
}

// Remove backend keys
const keysToRemove = ['ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_BASE_URL',
  'ANTHROPIC_DEFAULT_HAIKU_MODEL', 'ANTHROPIC_DEFAULT_SONNET_MODEL', 'ANTHROPIC_DEFAULT_OPUS_MODEL'];
keysToRemove.forEach(k => delete settings.env[k]);

// Only remove ANTHROPIC_API_KEY if it's empty string (set by OpenRouter switch)
if (settings.env.ANTHROPIC_API_KEY === '') {
  delete settings.env.ANTHROPIC_API_KEY;
}

// Remove env block if empty
if (Object.keys(settings.env).length === 0) {
  delete settings.env;
}

// Write
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('Switched to Claude (native Anthropic) backend.');
console.log('Removed backend env overrides from .claude/settings.local.json');
console.log('');
console.log('Restart Claude Code to apply changes.');
"
