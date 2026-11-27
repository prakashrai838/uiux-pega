# Northstar Enterprise Assistant

An Angular 22 reference UI for an enterprise assistant backed by Pega Platform '25. The project demonstrates a case dashboard, request intake, assistant workspace with citations, a human approval queue, and a case audit view.

## Run locally

Requirements: Node.js 22.22.3+, 24.15+, or 26+, npm 10+.

```bash
npm install
npm start
```

Open `http://localhost:4200`. The app starts in demo mode and uses seeded example cases; no Pega credentials or AI provider keys are needed.

## Screens

- **My Work** (`/`) — case summary cards, request list, status and search affordance.
- **New Request** (`/request/new`) — request intake, category, attachment selection, and privacy guidance.
- **Assistant Workspace** (`/cases/:id`) — conversation, citations, proposed action, async status, activity and case context.
- **Approvals** (`/approvals`) — approval queue with approve/reject actions.
- **Case Details** (`/cases/:id/details`) — case summary, activity history, source list, and audit metadata.

## Connect the enterprise backend

`src/environments/environment.ts` contains `demoMode` and `apiBaseUrl`. For an environment deployment, set `demoMode` to `false` and point `apiBaseUrl` at an authenticated API gateway/BFF. Do not place Pega passwords, OAuth client secrets, model keys, or Kafka credentials in Angular configuration; browser bundles are public to their users. Use enterprise SSO/OIDC in the browser and keep service credentials in the gateway or backend.

The `AssistantApiService` is the adapter seam. Its production-mode contract currently expects:

| Method | Gateway endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/cases` | List cases visible to the signed-in user |
| `GET` | `/api/cases/{id}` | Read the case summary and status |
| `POST` | `/api/cases` | Create a Pega case from the request form |
| `GET` | `/api/cases/{id}/messages` | Read assistant conversation entries |
| `POST` | `/api/cases/{id}/messages` | Add a follow-up and start or resume AI processing |
| `GET` | `/api/cases/{id}/events` | Read the case activity timeline |
| `POST` | `/api/cases/{id}/approval` | Submit an approval decision to the Pega workflow |

Implement the gateway contract with Pega DX API and/or Pega Service REST rules appropriate to the deployed application. The gateway should authenticate the caller, enforce authorization, map Pega case/assignment data to the UI DTOs in `src/app/models.ts`, and hide Pega service credentials. Use Pega assignment lifecycle for approvals; the UI must not execute an action directly. Route long-running AI work through the AI service and Kafka; return case state promptly and refresh from the case/event endpoints or add server-sent events/WebSocket notifications.

The sample content is illustrative only. RAG citations, source permissions, approvals, action execution, and audit retention must be enforced and recorded by the backend, not trusted to the browser.

## Project structure

```text
src/app/app.component.ts          application shell and navigation
src/app/app.routes.ts             screen routes
src/app/assistant-api.service.ts  demo backend and gateway adapter
src/app/models.ts                 UI data contracts
src/app/pages/                    screen components
src/environments/                 demo and deployment configuration
src/styles.scss                   responsive application design system
```

## Pega deployment notes

This is the Angular user interface and gateway contract, not a Pega application export. The corresponding Pega application still needs Case Types, assignment/approval flows, access roles, Agent/Tool Rules where used, REST/DX API configuration, and audit policies. In Pega Platform '25, deploy Pega in a supported containerized environment and configure enterprise Kafka separately for Kafka Data Sets when that is part of the chosen integration design.

