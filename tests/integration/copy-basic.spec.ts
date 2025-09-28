import { test, expect } from '@playwright/test';

/**
 * Basic integration tests for copy functionality
 * Tests core copy button visibility and basic interaction
 */

test.describe('Copy Button Basic Tests', () => {
  // Skip WebKit due to protocol errors with clipboard API testing
  test.skip(({ browserName }) => browserName === 'webkit', 'WebKit has clipboard API testing issues');
  // Skip Firefox testing
  test.skip(({ browserName }) => browserName === 'firefox', 'Skipping Firefox testing');
  
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should show copy button after assistant response', async ({ page }) => {
    // Send a simple message
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Hello');
    await sendButton.click();
    
    // Wait for assistant response with a longer timeout
    await page.waitForSelector('[data-role="assistant"]', { timeout: 15000 });
    
    // Check that copy button is visible
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    await expect(copyButton).toBeVisible();
  });

  test('should handle copy button click', async ({ page }) => {
    // Send a message and wait for response first
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test message');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 15000 });
    
    // Set up mock right before clicking (this ensures it's active)
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            console.log('Mock clipboard write:', text);
            return Promise.resolve();
          }
        },
        configurable: true
      });
      
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true,
        configurable: true
      });
    });
    
    // Click copy button
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    await copyButton.click();
    
    // Wait a moment for any potential error to appear
    await page.waitForTimeout(1000);
    
    // Check that no error message appears (success case)
    const errorMessage = page.locator('[data-testid="copy-error"]');
    await expect(errorMessage).not.toBeVisible();
  });

  test('should show error message when clipboard fails', async ({ page }) => {
    // Send a message and wait for response first
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test error handling');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 15000 });
    
    // Set up mock to fail right before clicking
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async () => {
            throw new DOMException('Document is not focused.', 'NotAllowedError');
          }
        },
        configurable: true
      });
      
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true,
        configurable: true
      });
    });
    
    // Click copy button
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    await copyButton.click();
    
    // Check that error message appears
    const errorMessage = page.locator('[data-testid="copy-error"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    // Check for the actual error message that appears
    await expect(errorMessage).toContainText('Copy operation failed');
  });
});
