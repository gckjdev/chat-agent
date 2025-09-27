import { test, expect } from '@playwright/test';

/**
 * Performance tests for copy functionality
 * Ensures copy operations meet performance requirements (<100ms)
 */

test.describe('Copy Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('copy operation should complete within 100ms', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Generate a short response for performance testing');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Measure copy operation time
    const startTime = Date.now();
    await copyButton.click();
    
    // Wait for copy feedback to appear (indicates completion)
    await page.waitForSelector('[data-testid="copy-feedback"]', { timeout: 2000 });
    const endTime = Date.now();
    
    const copyDuration = endTime - startTime;
    
    // Copy operation should complete within 100ms
    expect(copyDuration).toBeLessThan(100);
  });

  test('copy operation for long messages should complete within 200ms', async ({ page }) => {
    // Send a message that will generate a longer response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Write a detailed 500-word explanation about React hooks');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 15000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Measure copy operation time for long content
    const startTime = Date.now();
    await copyButton.click();
    
    // Wait for copy feedback
    await page.waitForSelector('[data-testid="copy-feedback"]', { timeout: 3000 });
    const endTime = Date.now();
    
    const copyDuration = endTime - startTime;
    
    // Even for long messages, should complete within 200ms
    expect(copyDuration).toBeLessThan(200);
  });

  test('multiple rapid copy operations should maintain performance', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Short test message');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Perform multiple rapid copy operations
    const copyTimes: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      await copyButton.click();
      
      // Wait for feedback to appear and disappear
      await page.waitForSelector('[data-testid="copy-feedback"]', { timeout: 1000 });
      const endTime = Date.now();
      
      copyTimes.push(endTime - startTime);
      
      // Small delay between operations
      await page.waitForTimeout(100);
    }
    
    // All copy operations should be fast
    copyTimes.forEach((time, index) => {
      expect(time).toBeLessThan(100); // Each operation under 100ms
    });
    
    // Average time should be well under limit
    const averageTime = copyTimes.reduce((sum, time) => sum + time, 0) / copyTimes.length;
    expect(averageTime).toBeLessThan(75);
  });

  test('copy button should respond immediately to clicks', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test immediate response');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Check button state changes immediately
    const initialClasses = await copyButton.getAttribute('class');
    
    const startTime = Date.now();
    await copyButton.click();
    
    // Button should show visual feedback immediately (state change)
    await page.waitForFunction(
      (button) => button.getAttribute('class') !== button.dataset.initialClasses,
      copyButton,
      { timeout: 50 } // Very short timeout - should change immediately
    );
    
    const responseTime = Date.now() - startTime;
    
    // Visual feedback should appear within 50ms
    expect(responseTime).toBeLessThan(50);
  });

  test('copy operation should not block UI interactions', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test UI blocking');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Start copy operation
    await copyButton.click();
    
    // Immediately try to interact with other UI elements
    const startTime = Date.now();
    
    // Should be able to type in input field immediately
    await messageInput.click();
    await messageInput.fill('New message while copying');
    
    const interactionTime = Date.now() - startTime;
    
    // UI should remain responsive (interaction time should be minimal)
    expect(interactionTime).toBeLessThan(50);
  });

  test('copy feedback should appear and disappear within expected timeframes', async ({ page }) => {
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Test feedback timing');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Measure feedback appearance time
    const clickTime = Date.now();
    await copyButton.click();
    
    await page.waitForSelector('[data-testid="copy-feedback"]', { timeout: 1000 });
    const feedbackAppearTime = Date.now() - clickTime;
    
    // Feedback should appear quickly
    expect(feedbackAppearTime).toBeLessThan(100);
    
    // Wait for feedback to disappear (should be ~2-3 seconds)
    const feedbackStartTime = Date.now();
    await page.waitForSelector('[data-testid="copy-feedback"]', { state: 'hidden', timeout: 5000 });
    const feedbackDuration = Date.now() - feedbackStartTime;
    
    // Feedback should disappear within reasonable time (2-4 seconds)
    expect(feedbackDuration).toBeGreaterThan(1500); // At least 1.5 seconds
    expect(feedbackDuration).toBeLessThan(4000); // But less than 4 seconds
  });

  test('memory usage should remain stable during copy operations', async ({ page }) => {
    // This test checks that copy operations don't cause memory leaks
    
    // Send a message to get an assistant response
    const messageInput = page.locator('input[type="text"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('Memory usage test message');
    await sendButton.click();
    
    // Wait for assistant response
    await page.waitForSelector('[data-role="assistant"]', { timeout: 10000 });
    
    const assistantMessage = page.locator('[data-role="assistant"]').first();
    const copyButton = assistantMessage.locator('[data-testid="copy-button"]');
    
    // Perform many copy operations
    for (let i = 0; i < 20; i++) {
      await copyButton.click();
      await page.waitForTimeout(100); // Brief pause between operations
    }
    
    // Check that the page is still responsive
    const finalStartTime = Date.now();
    await copyButton.click();
    await page.waitForSelector('[data-testid="copy-feedback"]', { timeout: 1000 });
    const finalCopyTime = Date.now() - finalStartTime;
    
    // Performance should not degrade after many operations
    expect(finalCopyTime).toBeLessThan(100);
  });
});
