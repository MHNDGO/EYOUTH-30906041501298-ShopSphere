# Architecture Decision Record — ShopSphere Modernization

**Student ID:** EYOUTH-30906041501298
**Date:** 2026-08-27

## 1. Service extracted: Reviews

The product reviews feature was extracted from the ShopSphere monolith into an
independently deployed **review-service** (own codebase, own Vercel deployment,
own MongoDB connection).

**Why reviews was a suitable candidate:** reviews were already a bounded, self-contained
domain in the codebase — their own Mongoose model, controller, and routes, backed by
MongoDB rather than the core Postgres schema used by products/users/orders. That meant
zero foreign-key coupling to the rest of the application, so the extraction required no
changes to the relational data model — only replacing the in-process call with a REST
call. Reviews also have a different load and consistency profile than checkout/inventory
(read-heavy, no strict consistency requirement with orders), making them a good
candidate to scale or fail independently of the transactional core.

## 2. Workload moved to serverless: Activity log pruning

A background job that deletes `ActivityLog` entries older than 30 days was implemented
as a standalone Vercel serverless function (`/api/serverless/prune-logs`), separate from
the main Express application.

**Why serverless suits this workload:** log pruning is infrequent (intended to run on a
schedule, e.g. daily), stateless, and has no user-facing latency requirement. Running it
inside the always-on backend would mean paying for compute the task doesn't need between
runs. A serverless function only consumes resources for the few seconds it actually
executes, and it can be triggered independently (via Vercel Cron or a manual call)
without competing with request traffic on the main API.

## 3. Summary

| Decision | What moved | Why |
|---|---|---|
| Microservice | Reviews (model, controller, routes) | Already isolated on a separate DB; independent scaling/failure domain |
| Serverless | Activity log pruning | Infrequent, stateless, no need for always-on compute |
