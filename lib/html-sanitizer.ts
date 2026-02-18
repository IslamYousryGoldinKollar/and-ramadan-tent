/**
 * Minimal server-side HTML sanitization.
 *
 * NOTE: This is a defensive baseline without external dependencies.
 * It removes high-risk tags/attributes and unsafe URL protocols.
 */

const BLOCKED_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
]

const BLOCKED_TAGS_REGEX = new RegExp(
  `<(?:${BLOCKED_TAGS.join('|')})\\b[^>]*>([\\s\\S]*?)<\\/(?:${BLOCKED_TAGS.join('|')})>|<(?:${BLOCKED_TAGS.join('|')})\\b[^>]*\\/?\\s*>`,
  'gi'
)

const EVENT_HANDLER_ATTR_REGEX = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const STYLE_ATTR_REGEX = /\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const SRCDOC_ATTR_REGEX = /\s+srcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const UNSAFE_URL_ATTR_REGEX = /\s+(href|src|xlink:href|formaction)\s*=\s*("|')\s*(?:javascript:|data:text\/html|vbscript:)[\s\S]*?\2/gi
const UNSAFE_URL_ATTR_UNQUOTED_REGEX = /\s+(href|src|xlink:href|formaction)\s*=\s*(?:javascript:|data:text\/html|vbscript:)[^\s>]*/gi

export function sanitizeHtml(input: string): string {
  if (!input) return ''

  return input
    .replace(/\u0000/g, '')
    .replace(BLOCKED_TAGS_REGEX, '')
    .replace(EVENT_HANDLER_ATTR_REGEX, '')
    .replace(STYLE_ATTR_REGEX, '')
    .replace(SRCDOC_ATTR_REGEX, '')
    .replace(UNSAFE_URL_ATTR_REGEX, '')
    .replace(UNSAFE_URL_ATTR_UNQUOTED_REGEX, '')
    .trim()
}
