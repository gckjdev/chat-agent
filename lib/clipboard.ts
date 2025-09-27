/**
 * Clipboard utility functions for copying text content
 * Provides browser-compatible clipboard operations with fallbacks
 */

export interface CopyResult {
  success: boolean;
  error?: string;
}

/**
 * Copy text to clipboard using modern Clipboard API with fallback
 * @param text - The text content to copy
 * @returns Promise resolving to copy operation result
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  // Check if clipboard API is available
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error('❌ Clipboard API failed:', error);
      return { 
        success: false, 
        error: 'Clipboard access denied. Please check browser permissions.' 
      };
    }
  }

  // Fallback for older browsers or insecure contexts
  return copyToClipboardFallback(text);
}

/**
 * Fallback clipboard implementation using document.execCommand
 * @param text - The text content to copy
 * @returns Copy operation result
 */
function copyToClipboardFallback(text: string): CopyResult {
  try {
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.focus();
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Copy operation failed. Please manually select and copy the text.' 
      };
    }
  } catch (error) {
    console.error('❌ Fallback copy failed:', error);
    return { 
      success: false, 
      error: 'Copy operation not supported in this browser.' 
    };
  }
}

/**
 * Extract raw text content from message parts
 * @param parts - Array of message parts from AI SDK
 * @returns Plain text content without formatting
 */
export function extractRawText(parts: any[]): string {
  if (!parts || !Array.isArray(parts)) {
    return '';
  }

  return parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('');
}

/**
 * Check if clipboard operations are supported
 * @returns True if clipboard API or fallback is available
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard || document.execCommand);
}
