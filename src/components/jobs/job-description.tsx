'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cleanHtmlContent, truncateHtmlContent, getPlainTextFromHtml } from '@/lib/description-utils'

interface JobDescriptionProps {
  html: string
  maxLength?: number
}

export function JobDescription({ html, maxLength = 800 }: JobDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!html) {
    return (
      <div className="text-muted-foreground italic">
        No job description available.
      </div>
    )
  }
  
  // Clean the HTML content
  const cleanedHtml = cleanHtmlContent(html)
  
  // Check if truncation is needed
  const { truncated, isTruncated } = truncateHtmlContent(cleanedHtml, maxLength)
  
  // Get word count for stats
  const plainText = getPlainTextFromHtml(cleanedHtml)
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
  
  const displayHtml = isExpanded ? cleanedHtml : truncated
  
  return (
    <div className="space-y-4">
      {/* Description content */}
      <div 
        className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />
      
      {/* Read more/less toggle */}
      {isTruncated && (
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? '← Read Less' : 'Read More →'}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            {isExpanded ? (
              <span>Showing full description ({wordCount} words)</span>
            ) : (
              <span>
                Showing preview • {wordCount} words total
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Show word count even if not truncated, but make it subtle */}
      {!isTruncated && wordCount > 50 && (
        <div className="text-xs text-muted-foreground/70 pt-2">
          {wordCount} words
        </div>
      )}
    </div>
  )
} 