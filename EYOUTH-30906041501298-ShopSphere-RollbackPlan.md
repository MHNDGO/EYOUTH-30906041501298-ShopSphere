# Rollback Plan — ShopSphere

**Student ID:** EYOUTH-30906041501298

## Detecting a failed release

Production is watched by an UptimeRobot HTTP(s) monitor pointed at
`https://shopsphere-backend-brown.vercel.app/api/health` (configured in Task 1.4). The
monitor polls the health endpoint every 5 minutes and flags the service **Down** if it
stops returning a 200 response — which happens immediately after a bad deploy, since a
crashing serverless function (e.g. a bad env var, a broken import) fails on every
invocation, including health checks. UptimeRobot sends an alert (email/dashboard) the
moment this happens, which is the trigger to begin rollback.

## Restoring the previous working version

1. **Confirm the failure.** Open `/api/health` directly and check the Vercel Runtime
   Logs (Project → Logs) for the error causing the 500s.
2. **Open Vercel → the affected project (backend/frontend/review-service) → Deployments.**
   Every previous deployment is listed and kept, each tied to the git commit that
   produced it.
3. **Find the last deployment marked "Ready" before the failing one.** Click its `⋯`
   menu → **Promote to Production** (or **Redeploy**). This immediately repoints the
   production domain (e.g. `shopsphere-backend-brown.vercel.app`) at the last known-good
   build, without needing a new git push.
4. **Verify recovery.** Reload `/api/health` — it should return 200 again. UptimeRobot's
   dashboard should flip back to **Up** within one monitoring interval.
5. **Fix forward.** With production stable again, fix the underlying issue in a new
   commit, let the CI/CD pipeline (Task 4.1) build and test it, and merge to `main` only
   once it passes — this becomes the new production deployment.
