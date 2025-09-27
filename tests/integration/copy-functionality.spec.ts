import { test, expect } from '@playwright/test';

/**
 * Integration tests for copy functionality
 * Tests FR-003: Users MUST be able to click the copy icon to copy the message content
 * Tests FR-004: System MUST copy the raw text content (without formatting or markdown)
 * Tests FR-007: Each message MUST have its own independent copy functionality
 */

test.describe('Copy Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should copy raw text content when copy icon is clicked', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Please respond with some **markdown** text');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Get clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    
    // Verify clipboard contains raw text (no markdown formatting)
    expect(clipboardContent).toBeTruthy();
    expect(clipboardContent).not.toContain('**'); // No markdown bold markers
    expect(clipboardContent).not.toContain('*'); // No markdown emphasis markers
  });

  test('should copy complete message content for long messages', async ({ page }) => {
    // Send a message that will generate a long response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Please write a detailed explanation about JavaScript');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 15000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Get the visible message content
    const messageText = await assistantMessage.locator('.prose').textContent();
    
    // Click copy button
    await copyButton.click();
    
    // Get clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    
    // Verify clipboard contains the complete message
    expect(clipboardContent.length).toBeGreaterThan(100); // Long message
    expect(clipboardContent.trim()).toBe(messageText?.trim());
  });

  test('should copy different content for different messages', async ({ page }) => {
    // Send first message
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Say exactly: First response');
    await sendButton.click();
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    // Send second message
    await messageInput.fill('Say exactly: Second response');
    await sendButton.click();
    await page.waitForSelector('[data-role="assistant"]:nth-child(4)', { timeout: 10000 });
    
    // Copy first message
    const firstMessage = page.locator('[data-role="assistant"]').first();
    const firstCopyButton = firstMessage.locator('[data-testid="copy-button"]');
    await firstCopyButton.click();
    
    const firstClipboard = await page.evaluate(() => navigator.clipboard.readText());
    
    // Copy second message
    const secondMessage = page.locator('[data-role="assistant"]').nth(1);
    const secondCopyButton = secondMessage.locator('[data-testid="copy-button"]');
    await secondCopyButton.click();
    
    const secondClipboard = await page.evaluate(() => navigator.clipboard.readText());
    
    // Verify different content was copied
    expect(firstClipboard).not.toBe(secondClipboard);
    expect(firstClipboard).toContain('First response');
    expect(secondClipboard).toContain('Second response');
  });

  test('should handle empty or minimal message content', async ({ page }) => {
    // Send a message that might generate minimal response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Say: OK');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Get clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    
    // Verify clipboard has some content (even if minimal)
    expect(clipboardContent).toBeDefined();
    expect(clipboardContent.length).toBeGreaterThan(0);
  });
});
