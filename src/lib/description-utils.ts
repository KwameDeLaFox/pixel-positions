/**
 * Utilities for cleaning and formatting job descriptions
 */

/**
 * Clean HTML content by removing unwanted tags, attributes, and formatting
 */
export function cleanHtmlContent(html: string): string {
  if (!html) return ''
  
  // First, decode HTML entities
  let cleaned = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
  
  // Remove style attributes and inline styles
  cleaned = cleaned.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '')
  
  // Remove class attributes (they won't work with our styling anyway)
  cleaned = cleaned.replace(/\s*class\s*=\s*["'][^"']*["']/gi, '')
  
  // Remove font tags and replace with spans
  cleaned = cleaned.replace(/<\/?font[^>]*>/gi, '')
  
  // Remove div tags but keep content (divs don't work well in prose)
  cleaned = cleaned.replace(/<div[^>]*>/gi, '<p>').replace(/<\/div>/gi, '</p>')
  
  // Clean up table formatting - convert to simple lists
  cleaned = cleaned.replace(/<table[^>]*>/gi, '<div>')
    .replace(/<\/table>/gi, '</div>')
    .replace(/<tr[^>]*>/gi, '')
    .replace(/<\/tr>/gi, '<br>')
    .replace(/<td[^>]*>/gi, '')
    .replace(/<\/td>/gi, ' ')
    .replace(/<th[^>]*>/gi, '<strong>')
    .replace(/<\/th>/gi, '</strong> ')
  
  // Fix multiple consecutive line breaks
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
  
  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
  
  // Remove empty tags
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '')
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
  
  return cleaned
}

/**
 * Get plain text content from HTML (for length calculations)
 */
export function getPlainTextFromHtml(html: string): string {
  if (!html) return ''
  
  // Remove all HTML tags
  let text = html.replace(/<[^>]*>/g, ' ')
  
  // Decode entities and clean whitespace
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
  
  return text
}

/**
 * Truncate HTML content at word boundaries while preserving tags
 */
export function truncateHtmlContent(html: string, maxLength: number = 800): {
  truncated: string
  isTruncated: boolean
  originalLength: number
} {
  if (!html) return { truncated: '', isTruncated: false, originalLength: 0 }
  
  const plainText = getPlainTextFromHtml(html)
  const originalLength = plainText.length
  
  if (originalLength <= maxLength) {
    return { truncated: html, isTruncated: false, originalLength }
  }
  
  // Find a good truncation point in the plain text
  let truncateAt = maxLength
  const words = plainText.substring(0, maxLength).split(' ')
  
  // Remove the last partial word to end at word boundary
  if (words.length > 1) {
    words.pop()
    truncateAt = words.join(' ').length
  }
  
  // Now truncate the HTML while preserving structure
  let currentLength = 0
  let result = ''
  let inTag = false
  const tagStack: string[] = []
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i]
    
    if (char === '<') {
      inTag = true
      result += char
    } else if (char === '>') {
      inTag = false
      result += char
      
      // Track opening/closing tags
      const tagMatch = result.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>$/)?.[1]
      if (tagMatch) {
        if (result.includes('</')) {
          // Closing tag - remove from stack
          const lastIndex = tagStack.lastIndexOf(tagMatch.toLowerCase())
          if (lastIndex !== -1) {
            tagStack.splice(lastIndex, 1)
          }
        } else if (!result.includes('/>')) {
          // Opening tag - add to stack
          tagStack.push(tagMatch.toLowerCase())
        }
      }
    } else if (!inTag) {
      if (currentLength >= truncateAt) {
        break
      }
      result += char
      currentLength++
    } else {
      result += char
    }
  }
  
  // Close any remaining open tags
  while (tagStack.length > 0) {
    const tag = tagStack.pop()
    result += `</${tag}>`
  }
  
  return { 
    truncated: result + '...', 
    isTruncated: true, 
    originalLength 
  }
}

/**
 * Extract a preview/summary from job description
 */
export function extractJobDescriptionPreview(html: string, maxLength: number = 200): string {
  const plainText = getPlainTextFromHtml(html)
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  // Find first sentence or paragraph that fits
  const sentences = plainText.split(/[.!?]+/)
  let preview = ''
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue
    
    if ((preview + ' ' + trimmed).length <= maxLength) {
      preview += (preview ? ' ' : '') + trimmed + '.'
    } else {
      break
    }
  }
  
  if (!preview) {
    // Fallback to simple truncation
    const words = plainText.substring(0, maxLength).split(' ')
    words.pop() // Remove last partial word
    preview = words.join(' ') + '...'
  }
  
  return preview
} 