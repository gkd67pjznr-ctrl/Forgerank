# USER TESTING CHECKLIST
**Admin/User-Side Testing Instructions**

---

## Document Info
- **Created:** 2026-01-27
- **Last Updated:** 2026-01-27
- **Purpose:** Checklist for user to test new features on Expo Go

---

## How to Use This Checklist

1. **Before Testing:**
   - Run `npm start` to start the dev server
   - Open Expo Go on your device
   - Scan QR code or enter URL
   - Wait for bundle to load

2. **During Testing:**
   - Go through each test case systematically
   - Mark ✅ for pass, ❌ for fail, ⚠️ for issues
   - Note any bugs, crashes, or UX problems

3. **After Testing:**
   - Report results back to Claude
   - Provide feedback on UX/feel
   - Suggest any improvements

---

## Latest Testing Session

### Routine-Based Workout Flow
**Date:** 2026-01-27
**Features Tested:**
- P0: Start workout from routine
- P1: Routine progress indicator
- P2: Workout summary screen
- P3: Quick-start from list

---

## Test Cases

### P0: Start Workout from Routine

#### TC-R1: Start workout from routine detail page
**Steps:**
1. Navigate to Routines tab
2. Tap on any routine
3. Tap "Start Workout" button
4. Verify you're taken to live-workout screen
5. Verify routine exercises are shown as blocks

**Expected:** Navigate to live-workout with routine loaded as plan
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R2: Start routine with active session confirmation
**Steps:**
1. Start any workout (log at least 1 set)
2. Go to Routines tab
3. Tap on a routine
4. Tap "Start Workout" button
5. Verify confirmation dialog appears
6. Tap "Cancel"
7. Verify you stay on routine detail
8. Tap "Start Workout" again
9. Tap "Start Routine"
10. Verify old session is cleared, new routine starts

**Expected:** Confirmation dialog shown, choice respected
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

### P1: Routine Progress Indicator

#### TC-R3: Progress summary shown during workout
**Steps:**
1. Start a routine workout (from P0)
2. Verify "Progress" card appears at top of exercise blocks
3. Verify progress percentage is shown
4. Verify progress bar fills correctly
5. Log a set for first exercise
6. Verify progress updates

**Expected:** Progress summary visible and updates in real-time
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R4: Progress stats accuracy
**Steps:**
1. Start a routine with known targets (e.g., 3 sets per exercise)
2. Complete 1 set for exercise 1
3. Verify shows "1/3 sets"
4. Complete 2 more sets for exercise 1
5. Verify shows "3/3 sets"
6. Verify progress bar is ~33% (if 3 exercises)
7. Verify "X exercises left" text is accurate

**Expected:** Progress stats match actual sets logged vs targets
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R5: Progress colors at completion levels
**Steps:**
1. Start a routine workout
2. Complete sets to reach ~25% progress
3. Verify progress bar color (should be warning/yellow)
4. Complete sets to reach ~50% progress
5. Verify progress bar color (should be primary)
6. Complete sets to reach 100% progress
7. Verify progress bar color (should be success/green)
8. Verify "All exercises complete!" message

**Expected:** Colors change based on completion level
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

### P2: Workout Summary Screen

#### TC-R6: Summary screen appears after finish
**Steps:**
1. Complete a workout (log at least 1 set)
2. Tap "Finish Workout"
3. Verify workout summary screen appears
4. Verify workout duration is shown correctly
5. Verify set count matches what you logged
6. Verify exercises list is accurate

**Expected:** Summary screen shows correct workout data
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R7: Summary shows routine completion
**Steps:**
1. Start a routine workout
2. Complete partial workout (don't finish all sets)
3. Tap "Finish Workout"
4. Verify completion percentage is shown
5. Verify progress bar is accurate
6. Verify encouraging message appears

**Expected:** Completion % and message displayed correctly
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R8: Summary "Done" button
**Steps:**
1. Finish any workout to see summary
2. Tap "Done" button
3. Verify you return to home screen

**Expected:** Navigates to home screen
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R9: Summary "Share to Feed" button
**Steps:**
1. Finish any workout to see summary
2. Tap "Share to Feed" button
3. Verify button shows loading state
4. Note: This is scaffolded, may not fully work yet

**Expected:** Button shows loading, may show placeholder behavior
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

### P3: Quick-Start from List

#### TC-R10: Quick-start button on routine list
**Steps:**
1. Navigate to Routines tab
2. Verify each routine card has "Start Workout" button
3. Tap "Start Workout" on any routine
4. Verify workout starts immediately
5. Verify correct routine is loaded

**Expected:** Quick-start works without going to detail view
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R11: Quick-start with active session
**Steps:**
1. Start any workout (log at least 1 set)
2. Go to Routines list
3. Tap "Start Workout" on any routine
4. Verify confirmation dialog appears
5. Test both "Cancel" and "Start Routine" options

**Expected:** Same confirmation flow as detail page
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

#### TC-R12: Tap card body for details
**Steps:**
1. Go to Routines list
2. Tap on the card body (not the button)
3. Verify you navigate to routine detail page
4. Verify "Start Workout" button still works from detail

**Expected:** Card body navigates to detail, button quick-starts
**Result:** ⬜ Pass / ❌ Fail / ⚠️ Issue

**Notes:**
```
[Your notes here]
```

---

## General Checks

### Performance
- ⬜ No lag when tapping buttons
- ⬜ Progress bar updates smoothly
- ⬜ Screen transitions feel fast (<1 second)

### Visual
- ⬜ Text is readable on all cards
- ⬜ Colors look good (progress bar, buttons)
- ⬜ Layout looks correct on your device
- ⬜ No visual glitches

### Data Persistence
- ⬜ Start a routine, close app, reopen - workout still active
- ⬜ Complete workout, close app, reopen - summary still accessible
- ⬜ Progress is saved correctly

---

## Bug Report Template

If you find any issues, use this format:

```markdown
## Bug Report
**Test Case:** TC-XX
**Device:** [iPhone X / Pixel 6 / etc.]
**OS:** [iOS 17 / Android 14 / etc.]

### What Happened
[Description of the bug]

### Expected
[What should have happened]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Screenshots/Videos
[If applicable]
```

---

## Feedback Questions

After testing, please provide feedback on:

1. **UX Experience:**
   - Is the progress indicator helpful?
   - Is the quick-start button convenient?
   - Is the summary screen satisfying?

2. **Confusion Points:**
   - Anything confusing about the flow?
   - Any unclear labels or buttons?

3. **Suggestions:**
   - What would make this better?
   - Any missing features?

---

**End of Testing Checklist**
*Add new test sessions above as features are completed*
