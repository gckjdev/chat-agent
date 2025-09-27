import { copyToClipboard, extractRawText } from '../../lib/clipboard';

/**
 * Unit tests for edge cases in copy functionality
 * Tests boundary conditions and unusual input scenarios
 */

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

console.error = jest.fn();

describe('Copy Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  describe('Long message handling', () => {
    test('handles extremely long messages (>10KB)', async () => {
      const longMessage = 'a'.repeat(15000); // 15KB
      const result = await copyToClipboard(longMessage);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(longMessage);
    });

    test('handles very long messages (>1MB)', async () => {
      const veryLongMessage = 'Lorem ipsum '.repeat(100000); // ~1.1MB
      const result = await copyToClipboard(veryLongMessage);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(veryLongMessage);
    });

    test('handles messages with only newlines', async () => {
      const newlineMessage = '\n'.repeat(1000);
      const result = await copyToClipboard(newlineMessage);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(newlineMessage);
    });
  });

  describe('Empty and minimal content', () => {
    test('handles empty string', async () => {
      const result = await copyToClipboard('');
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('');
    });

    test('handles single character', async () => {
      const result = await copyToClipboard('a');
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('a');
    });

    test('handles only whitespace', async () => {
      const whitespaceOnly = '   \t\n  ';
      const result = await copyToClipboard(whitespaceOnly);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(whitespaceOnly);
    });
  });

  describe('Special characters and encoding', () => {
    test('handles unicode characters', async () => {
      const unicodeText = '🚀 Hello 世界 🌟 Testing émojis and spëcial chars';
      const result = await copyToClipboard(unicodeText);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(unicodeText);
    });

    test('handles HTML entities', async () => {
      const htmlText = 'Test &lt;script&gt;alert("xss")&lt;/script&gt; &amp; more';
      const result = await copyToClipboard(htmlText);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(htmlText);
    });

    test('handles markdown formatting', async () => {
      const markdownText = '**Bold** *italic* `code` [link](url) \n# Header\n\n- List item';
      const result = await copyToClipboard(markdownText);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(markdownText);
    });

    test('handles escape sequences', async () => {
      const escapedText = 'Line 1\nLine 2\tTabbed\r\nCRLF\\"Quoted\\"';
      const result = await copyToClipboard(escapedText);
      
      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(escapedText);
    });
  });

  describe('extractRawText edge cases', () => {
    test('handles deeply nested message parts', () => {
      const complexParts = [
        { type: 'text', text: 'Start ' },
        { type: 'other', data: 'ignored' },
        { type: 'text', text: 'middle ' },
        { type: 'text', text: '' }, // Empty text part
        { type: 'text', text: 'end' }
      ];
      
      const result = extractRawText(complexParts);
      expect(result).toBe('Start middle end');
    });

    test('handles malformed message parts', () => {
      const malformedParts = [
        { type: 'text', text: 'Valid' },
        { type: 'text' }, // Missing text property
        { type: 'text', text: null }, // Null text
        { type: 'text', text: undefined }, // Undefined text
        'invalid part', // Wrong type
        { text: 'No type property' },
        { type: 'text', text: 'Another valid' }
      ];
      
      const result = extractRawText(malformedParts as any);
      expect(result).toBe('ValidAnother valid');
    });

    test('handles message parts with mixed content types', () => {
      const mixedParts = [
        { type: 'text', text: 'Text content' },
        { type: 'image', url: 'http://example.com/image.jpg' },
        { type: 'text', text: ' more text' },
        { type: 'code', language: 'javascript', content: 'console.log("hello")' },
        { type: 'text', text: ' final text' }
      ];
      
      const result = extractRawText(mixedParts);
      expect(result).toBe('Text content more text final text');
    });
  });

  describe('Performance and memory', () => {
    test('handles rapid successive copy operations', async () => {
      const promises = Array(100).fill(0).map((_, i) => 
        copyToClipboard(`Message ${i}`)
      );
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
      
      expect(mockWriteText).toHaveBeenCalledTimes(100);
    });

    test('handles concurrent copy operations', async () => {
      const concurrentPromises = [
        copyToClipboard('Message A'),
        copyToClipboard('Message B'),
        copyToClipboard('Message C')
      ];
      
      const results = await Promise.all(concurrentPromises);
      
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Browser compatibility edge cases', () => {
    test('handles clipboard API timeout', async () => {
      mockWriteText.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );
      
      const result = await copyToClipboard('test');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('clipboard access denied');
    });

    test('handles quota exceeded error', async () => {
      mockWriteText.mockRejectedValue(
        new DOMException('QuotaExceededError', 'QuotaExceededError')
      );
      
      const result = await copyToClipboard('test');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('handles network error during copy', async () => {
      mockWriteText.mockRejectedValue(
        new DOMException('NetworkError', 'NetworkError')
      );
      
      const result = await copyToClipboard('test');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Memory and cleanup', () => {
    test('does not leak memory with large strings', async () => {
      const largeParts = Array(1000).fill(0).map((_, i) => ({
        type: 'text',
        text: `Chunk ${i} `.repeat(100)
      }));
      
      const result = extractRawText(largeParts);
      
      // Should handle large extraction without issues
      expect(result.length).toBeGreaterThan(100000);
      expect(result).toContain('Chunk 0');
      expect(result).toContain('Chunk 999');
    });

    test('handles circular references gracefully', () => {
      const circularPart: any = { type: 'text', text: 'Test' };
      circularPart.self = circularPart;
      
      const result = extractRawText([circularPart]);
      expect(result).toBe('Test');
    });
  });
});
