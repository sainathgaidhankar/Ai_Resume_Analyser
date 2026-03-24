# AI Resume Checker - WebSocket Fix Plan (Puter.js v2 → v1)

## Steps:
- [x] Step 1: Disabled Puter.js in root.tsx, added dynamic load + fix in auth.tsx
- [x] Step 2: Test dev server - No more global WebSocket/404 errors (script loads only on /auth)
- [ ] Step 3: Verify upload flow works unchanged
- [ ] Step 4: Test /auth page - Puter login (expect possible 404 but graceful error)
- [ ] Step 5: Complete
- [ ] Step 4: Test puter.ts store functions if auth routes exist
- [ ] Step 5: Mark complete

Current: Starting Step 1
