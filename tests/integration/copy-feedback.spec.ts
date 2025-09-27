import { test, expect } from '@playwright/test';

/**
 * Integration tests for copy visual feedback
 * Tests FR-005: System MUST provide visual feedback when copy operation succeeds
 */

test.describe('Copy Visual Feedback', () => {
  test.beforeEach(async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should show visual feedback when copy succeeds', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test message for copy feedback');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Check for success feedback (could be toast, icon change, etc.)
    // Look for common feedback patterns
    const successIndicators = [
      page.locator('[data-testid="copy-success"]'),
      page.locator('.toast-success'),
      page.locator('[aria-label*="copied"]'),
      page.locator('text="Copied"'),
      page.locator('[data-testid="copy-feedback"]')
    ];
    
    // At least one success indicator should be visible
    let feedbackFound = false;
    for (const indicator of successIndicators) {
      try {
        await indicator.waitFor({ timeout: 2000 });
        feedbackFound = true;
        break;
      } catch {
        // Continue checking other indicators
      }
    }
    
    expect(feedbackFound).toBe(true);
  });

  test('should show temporary visual feedback that disappears', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test temporary feedback');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Check that feedback appears
    const feedbackElement = page.locator('[data-testid="copy-feedback"]');
    await expect(feedbackElement).toBeVisible();
    
    // Wait for feedback to disappear (typically 2-3 seconds)
    await expect(feedbackElement).not.toBeVisible({ timeout: 5000 });
  });

  test('should show different feedback states for copy icon', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test icon state changes');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Get initial icon state
    const initialIcon = await copyButton.locator('svg').getAttribute('class');
    
    // Click copy button
    await copyButton.click();
    
    // Check for icon state change (e.g., checkmark, different color)
    await page.waitForTimeout(500); // Allow time for state change
    const changedIcon = await copyButton.locator('svg').getAttribute('class');
    
    // Icon should change to indicate success
    expect(changedIcon).not.toBe(initialIcon);
  });

  test('should provide feedback for multiple copy operations', async ({ page }) => {
    // Send message to get assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test multiple feedback');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // First copy operation
    await copyButton.click();
    
    // Check for first feedback
    const firstFeedback = page.locator('[data-testid="copy-feedback"]');
    await expect(firstFeedback).toBeVisible();
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Second copy operation
    await copyButton.click();
    
    // Check for second feedback (should work independently)
    await expect(firstFeedback).toBeVisible();
  });

  test('should provide accessible feedback for screen readers', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test accessibility feedback');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Click copy button
    await copyButton.click();
    
    // Check for aria-live region or aria-label updates
    const accessibleFeedback = await page.locator('[aria-live]').textContent();
    
    expect(accessibleFeedback).toBeTruthy();
    expect(accessibleFeedback?.toLowerCase()).toContain('copied');
  });
});
