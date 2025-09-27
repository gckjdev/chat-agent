import { 
  copyToClipboard, 
  extractRawText, 
  isClipboardSupported 
} from '../../lib/clipboard';

/**
 * Unit tests for clipboard utility functions
 * Tests core clipboard operations and text processing
 */

// Mock DOM methods
const mockExecCommand = jest.fn();
const mockWriteText = jest.fn();

// Mock document and navigator
Object.defineProperty(document, 'execCommand', {
  value: mockExecCommand,
  writable: true
});

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true
});

Object.defineProperty(window, 'isSecureContext', {
  value: true,
  writable: true
});

// Mock console methods
console.error = jest.fn();

describe('Clipboard Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
    mockExecCommand.mockReturnValue(true);
    
    // Reset clipboard API availability
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true
    });
    
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true
    });
  });

  describe('copyToClipboard', () => {
    test('uses clipboard API when available', async () => {
      const testText = 'Test clipboard content';
      const result = await copyToClipboard(testText);
      
      expect(mockWriteText).toHaveBeenCalledWith(testText);
      expect(result).toEqual({ success: true });
    });

    test('returns error when clipboard API fails', async () => {
      mockWriteText.mockRejectedValue(new Error('Permission denied'));
      
      const result = await copyToClipboard('test');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Clipboard access denied. Please check browser permissions.');
    });

    test('falls back to execCommand when clipboard API unavailable', async () => {
      // Mock clipboard API as unavailable
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });
      
      const result = await copyToClipboard('test content');
      
      expect(result.success).toBe(true);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });

    test('returns error when both clipboard API and fallback fail', async () => {
      // Mock clipboard API as unavailable and make execCommand fail
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });
      mockExecCommand.mockReturnValue(false);
      
      const result = await copyToClipboard('test');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Copy operation failed. Please manually select and copy the text.');
    });

    test('handles insecure context gracefully', async () => {
      Object.defineProperty(window, 'isSecureContext', {
        value: false,
        writable: true
      });
      
      const result = await copyToClipboard('test');
      
      // Should fall back to execCommand
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result.success).toBe(true);
    });

    test('handles empty string input', async () => {
      const result = await copyToClipboard('');
      
      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(result.success).toBe(true);
    });

    test('handles very long text content', async () => {
      const longText = 'a'.repeat(100000);
      const result = await copyToClipboard(longText);
      
      expect(mockWriteText).toHaveBeenCalledWith(longText);
      expect(result.success).toBe(true);
    });
  });

  describe('extractRawText', () => {
    test('extracts text from message parts array', () => {
      const parts = [
        { type: 'text', text: 'Hello ' },
        { type: 'text', text: 'world!' }
      ];
      
      const result = extractRawText(parts);
      expect(result).toBe('Hello world!');
    });

    test('filters out non-text parts', () => {
      const parts = [
        { type: 'text', text: 'Hello ' },
        { type: 'image', data: 'base64...' },
        { type: 'text', text: 'world!' }
      ];
      
      const result = extractRawText(parts);
      expect(result).toBe('Hello world!');
    });

    test('handles empty parts array', () => {
      const result = extractRawText([]);
      expect(result).toBe('');
    });

    test('handles null/undefined input', () => {
      expect(extractRawText(null as any)).toBe('');
      expect(extractRawText(undefined as any)).toBe('');
    });

    test('handles non-array input', () => {
      expect(extractRawText('not an array' as any)).toBe('');
      expect(extractRawText({} as any)).toBe('');
    });

    test('handles parts without text property', () => {
      const parts = [
        { type: 'text', text: 'Valid text' },
        { type: 'text' }, // Missing text property
        { type: 'text', text: null }, // Null text
        { type: 'text', text: 'More valid text' }
      ];
      
      const result = extractRawText(parts);
      expect(result).toBe('Valid textMore valid text');
    });

    test('preserves whitespace and formatting', () => {
      const parts = [
        { type: 'text', text: 'Line 1\n' },
        { type: 'text', text: '  Indented line\n' },
        { type: 'text', text: 'Line 3' }
      ];
      
      const result = extractRawText(parts);
      expect(result).toBe('Line 1\n  Indented line\nLine 3');
    });
  });

  describe('isClipboardSupported', () => {
    test('returns true when clipboard API is available', () => {
      expect(isClipboardSupported()).toBe(true);
    });

    test('returns true when only execCommand is available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });
      expect(isClipboardSupported()).toBe(true);
    });

    test('returns false when neither method is available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });
      Object.defineProperty(document, 'execCommand', {
        value: undefined,
        writable: true
      });
      
      expect(isClipboardSupported()).toBe(false);
    });
  });

  // Integration-style tests for complex scenarios
  describe('Integration scenarios', () => {
    test('handles rapid successive copy operations', async () => {
      const results = await Promise.all([
        copyToClipboard('First'),
        copyToClipboard('Second'),
        copyToClipboard('Third')
      ]);
      
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
      
      expect(mockWriteText).toHaveBeenCalledTimes(3);
    });

    test('handles mixed success and failure scenarios', async () => {
      mockWriteText
        .mockResolvedValueOnce(undefined) // Success
        .mockRejectedValueOnce(new Error('Fail')) // Failure
        .mockResolvedValueOnce(undefined); // Success
      
      const results = await Promise.all([
        copyToClipboard('Success 1'),
        copyToClipboard('Failure'),
        copyToClipboard('Success 2')
      ]);
      
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });
});
