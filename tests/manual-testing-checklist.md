# Manual Testing Checklist: Copy Response Messages Feature

This checklist covers all acceptance scenarios from the feature specification to ensure complete functionality.

## Prerequisites
- [ ] Application is running on http://localhost:3000
- [ ] Browser has clipboard permissions (or can be granted during testing)
- [ ] Browser developer tools are open for monitoring console logs

## Test Scenarios

### 1. Copy Icon Visibility (FR-001, FR-002)

**Scenario**: Copy icon displayed prominently and always visible for assistant messages

**Steps**:
1. [ ] Navigate to `/chat`
2. [ ] Send message: "Hello, please respond with a test message"
3. [ ] Wait for assistant response
4. [ ] **Verify**: Copy icon is visible next to assistant message
5. [ ] **Verify**: Copy icon is NOT visible for user message
6. [ ] Move mouse away from message
7. [ ] **Verify**: Copy icon remains visible (not hover-only)
8. [ ] Send second message: "Another test message"
9. [ ] Wait for second assistant response
10. [ ] **Verify**: Both assistant messages have independent copy icons

**Expected Results**:
- ✅ Copy icon visible for every assistant message
- ✅ Copy icon always visible (not hover-dependent)
- ✅ No copy icon for user messages
- ✅ Multiple messages have independent copy icons

### 2. Copy Functionality (FR-003, FR-004, FR-007)

**Scenario**: Click copy icon to copy raw text content

**Steps**:
1. [ ] Send message: "Please respond with some **bold** and *italic* markdown text"
2. [ ] Wait for assistant response with markdown formatting
3. [ ] Click the copy icon
4. [ ] Open a text editor or notepad
5. [ ] Paste the clipboard content (Ctrl+V or Cmd+V)
6. [ ] **Verify**: Pasted content is raw text without markdown formatting
7. [ ] **Verify**: No `**` or `*` characters in pasted content
8. [ ] Send another message: "Say exactly: Second response"
9. [ ] Wait for response
10. [ ] Copy the second message
11. [ ] Paste in text editor
12. [ ] **Verify**: Second message content is different from first

**Expected Results**:
- ✅ Clipboard contains raw text (no markdown formatting)
- ✅ Different messages copy different content
- ✅ Copy operation works for each message independently

### 3. Visual Feedback (FR-005)

**Scenario**: Visual feedback when copy operation succeeds

**Steps**:
1. [ ] Send message: "Test visual feedback"
2. [ ] Wait for assistant response
3. [ ] Click copy icon
4. [ ] **Verify**: Icon changes (e.g., copy → checkmark)
5. [ ] **Verify**: Visual feedback appears (color change, animation, etc.)
6. [ ] Wait 2-3 seconds
7. [ ] **Verify**: Feedback disappears and icon returns to normal
8. [ ] Check browser console for success log
9. [ ] **Verify**: Console shows "✅ Message copied successfully"

**Expected Results**:
- ✅ Visual feedback appears immediately after clicking
- ✅ Feedback is clearly visible to user
- ✅ Feedback disappears after appropriate time
- ✅ Console logging confirms operation

### 4. Error Handling (FR-006)

**Scenario**: Graceful handling of copy operation failures

**Steps**:
1. [ ] Open browser developer tools
2. [ ] Go to Console tab
3. [ ] Run: `Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('Test error')) }})`
4. [ ] Send message: "Test error handling"
5. [ ] Wait for assistant response
6. [ ] Click copy icon
7. [ ] **Verify**: Error feedback is shown to user
8. [ ] **Verify**: No browser error alerts appear
9. [ ] **Verify**: Console shows error handling logs
10. [ ] Refresh page to restore normal clipboard functionality
11. [ ] Test normal copy operation works again

**Expected Results**:
- ✅ Error is handled gracefully
- ✅ User sees appropriate error message
- ✅ Application continues to function normally
- ✅ No uncaught exceptions in console

### 5. Long Message Handling

**Scenario**: Copy very long assistant responses

**Steps**:
1. [ ] Send message: "Please write a detailed 500-word explanation about React hooks"
2. [ ] Wait for long assistant response
3. [ ] Click copy icon
4. [ ] **Verify**: Copy operation completes quickly (under 200ms)
5. [ ] Paste in text editor
6. [ ] **Verify**: Complete message content is copied
7. [ ] **Verify**: No content truncation occurred

**Expected Results**:
- ✅ Long messages copy completely
- ✅ Copy operation remains fast
- ✅ No performance degradation

### 6. Rapid Operations

**Scenario**: Multiple quick copy operations

**Steps**:
1. [ ] Send message: "Short response for rapid testing"
2. [ ] Wait for assistant response
3. [ ] Click copy icon 5 times rapidly
4. [ ] **Verify**: Each click shows feedback
5. [ ] **Verify**: No errors or broken states
6. [ ] **Verify**: Final clipboard content is correct

**Expected Results**:
- ✅ Multiple rapid clicks handled gracefully
- ✅ No broken visual states
- ✅ Performance remains good

### 7. Keyboard Accessibility

**Scenario**: Copy using keyboard navigation

**Steps**:
1. [ ] Send message: "Test keyboard accessibility"
2. [ ] Wait for assistant response
3. [ ] Press Tab to navigate to copy button
4. [ ] **Verify**: Copy button receives focus (visible focus ring)
5. [ ] Press Enter key
6. [ ] **Verify**: Copy operation executes
7. [ ] **Verify**: Visual feedback appears
8. [ ] Navigate back to copy button
9. [ ] Press Space key
10. [ ] **Verify**: Copy operation executes again

**Expected Results**:
- ✅ Copy button is keyboard accessible
- ✅ Enter and Space keys trigger copy
- ✅ Focus indicators are visible
- ✅ Same functionality as mouse clicks

### 8. Browser Compatibility

**Scenario**: Test fallback clipboard implementation

**Steps**:
1. [ ] Open browser developer tools
2. [ ] Go to Console tab  
3. [ ] Run: `delete navigator.clipboard`
4. [ ] Send message: "Test fallback clipboard"
5. [ ] Wait for assistant response
6. [ ] Click copy icon
7. [ ] **Verify**: Copy operation still works
8. [ ] Paste in text editor
9. [ ] **Verify**: Content was copied successfully
10. [ ] **Verify**: Visual feedback still appears

**Expected Results**:
- ✅ Fallback method works when clipboard API unavailable
- ✅ Same user experience regardless of browser capabilities
- ✅ No functionality degradation

### 9. Empty Content Edge Cases

**Scenario**: Handle unusual message content

**Steps**:
1. [ ] Send message: "Respond with just: OK"
2. [ ] Wait for minimal assistant response
3. [ ] Click copy icon
4. [ ] Paste in text editor
5. [ ] **Verify**: Minimal content is copied correctly
6. [ ] Send message requesting response with special characters: "Use emojis and unicode: 🚀 Hello 世界"
7. [ ] Click copy icon on response
8. [ ] Paste and verify special characters preserved

**Expected Results**:
- ✅ Minimal content copied correctly
- ✅ Special characters and unicode preserved
- ✅ No errors with edge case content

### 10. UI Integration

**Scenario**: Copy button doesn't interfere with other functionality

**Steps**:
1. [ ] Send message: "Test UI integration"
2. [ ] Wait for assistant response
3. [ ] Try to select text in the message (click and drag)
4. [ ] **Verify**: Text selection works normally
5. [ ] Click copy button
6. [ ] **Verify**: Copy button click doesn't interfere with text selection
7. [ ] Scroll up and down in chat
8. [ ] **Verify**: Copy buttons remain properly positioned
9. [ ] Resize browser window
10. [ ] **Verify**: Copy buttons adjust responsively

**Expected Results**:
- ✅ Copy button doesn't interfere with text selection
- ✅ Proper positioning maintained during scrolling
- ✅ Responsive behavior on window resize
- ✅ No layout issues or overlap

## Test Completion

**Overall Assessment**:
- [ ] All core functionality working as specified
- [ ] Error handling is robust and user-friendly
- [ ] Performance meets requirements (<100ms for normal operations)
- [ ] Accessibility features function correctly
- [ ] Browser compatibility is maintained
- [ ] UI integration is seamless

**Issues Found** (if any):
```
[Record any issues discovered during testing]
```

**Testing Environment**:
- Browser: ________________
- OS: _____________________ 
- Date: ___________________
- Tester: _________________

**Final Approval**: 
- [ ] Feature ready for production deployment
- [ ] All acceptance criteria met
- [ ] No critical issues identified
