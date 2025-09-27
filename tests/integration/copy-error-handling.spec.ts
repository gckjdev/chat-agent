import { test, expect } from '@playwright/test';

/**
 * Integration tests for copy error handling
 * Tests FR-006: System MUST handle copy operation failures gracefully
 */

test.describe('Copy Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should handle clipboard permission denied gracefully', async ({ page }) => {
    // Mock clipboard API to throw permission error
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async () => {
            throw new DOMException('Document is not focused.', 'NotAllowedError');
          }
        }
      });
    });
    
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test permission denied error');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Check for error feedback
    const errorIndicators = [
      page.locator('[data-testid="copy-error"]'),
      page.locator('.toast-error'),
      page.locator('text="clipboard"i'),
      page.locator('text="permission"i'),
      page.locator('[role="alert"]')
    ];
    
    // At least one error indicator should be visible
    let errorFound = false;
    for (const indicator of errorIndicators) {
      try {
        await indicator.waitFor({ timeout: 3000 });
        errorFound = true;
        break;
      } catch {
        // Continue checking other indicators
      }
    }
    
    expect(errorFound).toBe(true);
  });

  test('should fall back to text selection when clipboard API unavailable', async ({ page }) => {
    // Mock clipboard API to be unavailable
    await page.addInitScript(() => {
      delete (navigator as any).clipboard;
      // Also mock execCommand to succeed
      document.execCommand = () => true;
    });
    
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test fallback method');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Should still show success feedback even with fallback method
    const successFeedback = page.locator('[data-testid="copy-feedback"]');
    await expect(successFeedback).toBeVisible();
  });

  test('should show error when both clipboard API and fallback fail', async ({ page }) => {
    // Mock both clipboard API and execCommand to fail
    await page.addInitScript(() => {
      delete (navigator as any).clipboard;
      document.execCommand = () => false;
    });
    
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test complete failure');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Check for error message
    const errorMessage = page.locator('text="not supported"i, text="failed"i, [data-testid="copy-error"]');
    await expect(errorMessage.first()).toBeVisible();
  });

  test('should handle network or browser security errors', async ({ page }) => {
    // Mock clipboard API to throw security error
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async () => {
            throw new DOMException('Access denied', 'SecurityError');
          }
        }
      });
    });
    
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test security error');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Should show user-friendly error message
    const errorMessage = page.locator('text="access denied"i, text="security"i, [data-testid="copy-error"]');
    await expect(errorMessage.first()).toBeVisible();
  });

  test('should allow retry after error', async ({ page }) => {
    let callCount = 0;
    
    // Mock clipboard API to fail first time, succeed second time
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async () => {
            (window as any).clipboardCallCount = ((window as any).clipboardCallCount || 0) + 1;
            if ((window as any).clipboardCallCount === 1) {
              throw new DOMException('First call fails', 'NotAllowedError');
            }
            return Promise.resolve();
          }
        }
      });
    });
    
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test retry functionality');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // First click - should fail
    await copyButton.click();
    const errorMessage = page.locator('[data-testid="copy-error"]');
    await expect(errorMessage).toBeVisible();
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Second click - should succeed
    await copyButton.click();
    const successMessage = page.locator('[data-testid="copy-feedback"]');
    await expect(successMessage).toBeVisible();
  });
});
