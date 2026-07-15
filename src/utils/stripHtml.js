/**
 * Strips HTML tags and decodes HTML entities from a string.
 * Returns clean, readable plain text.
 *
 * @param {string} html - The HTML string to sanitize
 * @param {number} [maxLength] - Optional max character length to truncate to
 * @returns {string} Clean plain text
 */
export function stripHtml(html, maxLength) {
  if (!html || typeof html !== 'string') return '';

  // 1. Remove all HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // 2. Decode common HTML entities
  const entityMap = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&#39;': "'",
    '&rsquo;': '\u2019',
    '&lsquo;': '\u2018',
    '&rdquo;': '\u201D',
    '&ldquo;': '\u201C',
    '&ndash;': '\u2013',
    '&mdash;': '\u2014',
    '&hellip;': '\u2026',
    '&trade;': '\u2122',
    '&copy;': '\u00A9',
    '&reg;': '\u00AE',
    '&bull;': '\u2022',
    '&middot;': '\u00B7',
    '&times;': '\u00D7',
    '&divide;': '\u00F7',
    '&euro;': '\u20AC',
    '&pound;': '\u00A3',
    '&yen;': '\u00A5',
    '&cent;': '\u00A2',
    '&deg;': '\u00B0',
    '&rarr;': '\u2192',
    '&larr;': '\u2190',
  };

  // Replace named entities
  Object.entries(entityMap).forEach(([entity, char]) => {
    text = text.replaceAll(entity, char);
  });

  // Decode numeric HTML entities (&#123; and &#x1F;)
  text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  // 3. Normalize whitespace: collapse multiple spaces/newlines into single space
  text = text.replace(/\s+/g, ' ').trim();

  // 4. Optionally truncate
  if (maxLength && text.length > maxLength) {
    // Try to break at last space before maxLength
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    text = (lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }

  return text;
}
