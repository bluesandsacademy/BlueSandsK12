#!/usr/bin/env bash
# Enforces the user-facing copy rules from AGENTS.md on files Claude edits.
#
#   1. No em dashes in copy. Code comments are exempt: they are not user-facing,
#      and lib/ is full of them deliberately.
#   2. No decorative lucide-react icons used as generic "this bit is exciting"
#      garnish. Only flags a file that actually imports from lucide-react.
#
# Scoped to .js/.jsx under app/ and components/, the surfaces a head teacher
# or proprietor actually reads.
set -uo pipefail

f=$(jq -r '.tool_response.filePath // .tool_input.file_path // empty' 2>/dev/null)
[ -n "$f" ] && [ -f "$f" ] || exit 0

case "$f" in
  *.js | *.jsx) ;;
  *) exit 0 ;;
esac

# Hook input carries an absolute path; the relative forms keep the script
# testable from the repo root.
case "$f" in
  */app/* | */components/* | app/* | components/*) ;;
  *) exit 0 ;;
esac

problems=""

# Strip line-comment and block-comment-body lines before looking for em dashes.
dashes=$(grep -n '—' "$f" 2>/dev/null \
  | grep -v ':[[:space:]]*//' \
  | grep -v ':[[:space:]]*\*' \
  | head -5)
if [ -n "$dashes" ]; then
  problems="Em dashes in user-facing copy (AGENTS.md: use a comma, a colon, or two sentences):
$dashes"
fi

if grep -q 'lucide-react' "$f" 2>/dev/null; then
  icons=$(grep -nE '(^|[^A-Za-z])(Sparkles|Wand2|Rocket|Zap)([^A-Za-z]|$)' "$f" 2>/dev/null | head -5)
  if [ -n "$icons" ]; then
    [ -n "$problems" ] && problems="$problems

"
    problems="${problems}Decorative icons (AGENTS.md: every icon must depict its subject; a badge with no icon beats a badge with a meaningless one):
$icons"
  fi
fi

[ -n "$problems" ] || exit 0

jq -nc \
  --arg reason "AGENTS.md copy-rule violations in $f:

$problems

Fix these before continuing." \
  --arg msg "Copy-rule check flagged $(basename "$f")" \
  '{decision: "block", reason: $reason, systemMessage: $msg}'
