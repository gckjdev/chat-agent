import { test, expect } from '@playwright/test';

/**
 * Integration tests for copy icon visibility
 * Tests FR-001: System MUST display a copy icon for every assistant response message
 * Tests FR-002: Copy icon MUST be always visible (not hidden behind hover states)
 */

test.describe('Copy Icon Display', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page and wait for it to load
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should display copy icon for assistant messages', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Hello, test message');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    // Check that copy icon is visible for assistant message
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    await expect(copyButton).toBeVisible();
  });

  test('should show copy icon as always visible, not hover-only', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test for always visible copy icon');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Verify copy button is visible without hovering
    await expect(copyButton).toBeVisible();
    
    // Verify copy button remains visible after moving mouse away
    await page.mouse.move(0, 0);
    await expect(copyButton).toBeVisible();
  });

  test('should not display copy icon for user messages', async ({ page }) => {
    // Send a message 
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('User message without copy icon');
    await sendButton.click();
    
    // Check that user message does not have copy icon
    const userMessage = page.locator('[data-role="user"]').first();
    const copyButton = userMessage.locator('[data-testid="copy-button"]');
    
    await expect(copyButton).not.toBeVisible();
  });

  test('should display independent copy icons for multiple assistant messages', async ({ page }) => {
    // Send multiple messages to get multiple responses
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    // First message
    await messageInput.fill('First test message');
    await sendButton.click();
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    // Second message
    await messageInput.fill('Second test message');
    await sendButton.click();
    await page.waitForSelector('[data-role="assistant"]:nth-child(4)', { timeout: 10000 });
    
    // Verify both assistant messages have copy icons
    const assistantMessages = page.locator('[data-role="assistant"]');
    const copyButtons = assistantMessages.locator('[data-testid="copy-button"]');
    
    await expect(copyButtons).toHaveCount(2);
    await expect(copyButtons.nth(0)).toBeVisible();
    await expect(copyButtons.nth(1)).toBeVisible();
  });
});
