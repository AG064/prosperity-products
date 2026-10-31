# Fix Summary Template

Use this template when delivering a bug fix to a client.

## Summary
**Issue:** [One-line description of the bug]
**Root cause:** [What was actually causing it]
**Fix:** [What was changed]

## Changes Made
| File | Change |
|------|--------|
| `src/components/Example.tsx` | Fixed state update in onClick handler |
| `src/utils/api.ts` | Added error handling for failed requests |

## How to Verify
1. [Step to reproduce original bug]
2. [Expected behavior after fix]
3. [Edge cases tested]

## Tests Performed
- [ ] Bug no longer reproduces in original environment
- [ ] No new console errors introduced
- [ ] Existing tests still pass
- [ ] Fix works on mobile (if relevant)
- [ ] No debug logs left in code

## Notes
[Any additional context, limitations, or recommendations]
