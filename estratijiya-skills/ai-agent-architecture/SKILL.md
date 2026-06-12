---
name: ai-agent-architecture
description: >
  The layered SYSTEM architecture for production AI agents on the Estratijiya stack — the
  8 layers (Interface → Orchestration → Reasoning → Memory → Knowledge/RAG → Tools →
  Guardrails → Eval) mapped to n8n + WhatsApp Cloud API (360dialog) + Claude/OpenAI +
  ClickUp/Notion. Use this to decide WHAT to build and how the pieces fit before wiring
  anything. Triggers include "اعمل architecture للـ agent", "هيكلة الـ agent", "agent
  layers", "RAG للـ bot", "ذاكرة الـ agent", "agent memory", "vector store", "guardrails",
  "agent architecture", "production agent design". Do NOT use for conversation/flow/persona
  UX design (use ai-agent-builder) or for the actual node-by-node n8n implementation (use
  n8n-automation-builder). Run this FIRST, then ai-agent-builder for the dialogue, then
  n8n-automation-builder to build.
---

# ai-agent-architecture

## Purpose
ai-agent-builder designs the *conversation* (intents, flow, persona, handoff). This skill
designs the *system* underneath it — the 8 layers that make an agent production-grade instead
of a brittle demo. Output is an architecture decision: which layers this agent needs, what
goes in each, and a per-layer checklist — on the Estratijiya stack. Borrowed principle from
Anthropic's agent patterns: **start simple, add a layer only when a real need forces it.**

Order of work: **this skill (architecture)** → ai-agent-builder (conversation/UX) →
n8n-automation-builder (implementation) → iterate via Layer 8.

---

## 1. The 8 layers (mapped to the Estratijiya stack)

| # | Layer | Job | On my stack |
|---|---|---|---|
| 1 | **Interface / Channel** | Where the user talks to the agent | WhatsApp Cloud API via **360dialog** (primary), web chat widget, Instagram/Messenger |
| 2 | **Orchestration / Router** | Receive, classify intent, route to the right flow | **n8n** webhook → switch/router; LLM classifier for fuzzy intent; one flow per job |
| 3 | **Reasoning / LLM** | Understand + generate | **Claude** (sonnet for quality, haiku for cheap/fast) or OpenAI; prompt per intent |
| 4 | **Memory** | Remember within & across chats | short-term: session store (n8n static data / Postgres / Sheets); long-term: contact profile in **Notion/CRM**; vector store only if needed (L5) |
| 5 | **Knowledge / RAG** | Answer from client's own content | retrieval over FAQs/products/docs; embeddings + vector DB (Supabase pgvector / Pinecone) — only when content is large/changing |
| 6 | **Tools / Actions** | Do things in the real world | **ClickUp** task, **Notion** write, CRM update, calendar booking, n8n sub-workflows |
| 7 | **Guardrails** | Keep it safe & on-scope | PII handling, scope limits, no-hallucination rules, profanity/abuse, fallback → human handoff |
| 8 | **Eval / Observability** | Know if it works, improve it | logging every turn, containment rate, CSAT, fallback log → weekly iteration |

---

## 2. Architecture diagram (ASCII)

```
                          ┌─────────────────────────────────────────┐
                          │   8  EVAL / OBSERVABILITY                │
                          │   logs · containment% · CSAT · weekly    │  (wraps everything)
                          └─────────────────────────────────────────┘
   USER
    │  WhatsApp / Web / IG
    ▼
┌──────────────────┐
│ 1 INTERFACE      │  360dialog (WhatsApp Cloud API) / web widget
└────────┬─────────┘
         ▼
┌──────────────────┐        ┌──────────────────┐
│ 2 ORCHESTRATION  │◄──────►│ 4 MEMORY         │  short-term session + long-term profile
│   n8n router     │        │  (store / Notion)│
└────────┬─────────┘        └──────────────────┘
         ▼
┌──────────────────┐        ┌──────────────────┐
│ 3 REASONING/LLM  │◄──────►│ 5 KNOWLEDGE/RAG  │  retrieval over client content (optional)
│   Claude/OpenAI  │        │  vector store    │
└────────┬─────────┘        └──────────────────┘
         ▼
┌──────────────────┐
│ 6 TOOLS/ACTIONS  │  ClickUp · Notion · CRM · booking · sub-workflows
└────────┬─────────┘
         ▼
┌──────────────────┐
│ 7 GUARDRAILS     │  PII · scope · no-hallucination · fallback → HUMAN HANDOFF
└────────┬─────────┘
         ▼
       REPLY  ──►  back through Interface to the user
```
Memory and RAG sit *beside* the reasoning loop (read/write), not in the linear path.
Guardrails gate the outbound reply. Eval observes the whole thing.

---

## 3. Minimum-viable layers vs full build (decision guide)

**MVP agent (most first builds) — 5 layers:**
`1 Interface + 2 Orchestration + 3 Reasoning + 6 Tools + 7 Guardrails`
- A WhatsApp FAQ/lead/booking bot needs no vector DB and no long-term memory. Use n8n routing,
  a prompt per intent, a couple of actions, and a hard fallback→handoff. Ship this first.

**Add Layer 4 (Memory)** when: the agent must recall the user across sessions (returning
customers, multi-day threads, "as we discussed last time").

**Add Layer 5 (RAG)** when **all** are true: the knowledge base is large (dozens+ of
docs/products), changes often, and stuffing it into the prompt is impractical or expensive.
If the FAQ fits in the system prompt → **do NOT build RAG.** (Simplicity rule.)

**Full build — all 8 layers:** large catalog + returning users + multiple real actions +
compliance-sensitive (PII) + a volume that justifies observability tooling.

> Rule: every added layer is added cost and a new failure mode. Justify each one out loud.

---

## 4. Per-layer checklist

**1 Interface** ☐ channel chosen ☐ 360dialog templates approved (proactive msgs) ☐ 24h
window respected for free-form ☐ quick-reply buttons/lists where supported.

**2 Orchestration** ☐ one n8n flow per job (not an everything-flow) ☐ deterministic switch
for known intents ☐ LLM classifier only for fuzzy input ☐ session id keyed on contact.

**3 Reasoning** ☐ model chosen per intent (haiku cheap / sonnet quality) ☐ system prompt with
role + scope + persona (from ai-agent-builder) ☐ temperature sane ☐ token/cost budget noted.

**4 Memory** ☐ short-term: last intent + filled slots + handoff flag ☐ long-term: profile
store (Notion/CRM) ☐ write-back after each turn ☐ TTL / privacy on stored data.

**5 Knowledge/RAG** ☐ RAG actually justified (§3) ☐ source content cleaned/chunked ☐
embeddings + vector store chosen ☐ retrieval top-k tuned ☐ answer cites/grounds in retrieved
text ☐ "I don't know" path when retrieval is empty.

**6 Tools/Actions** ☐ each action idempotent / confirmed before firing ☐ ClickUp/Notion/CRM
creds in n8n credentials (not hardcoded) ☐ failure → graceful message, not silence ☐ sensitive
actions require confirmation.

**7 Guardrails** ☐ PII: don't log/echo what you shouldn't ☐ scope limit (refuse off-topic) ☐
no-hallucination: only answer from prompt/RAG, else handoff ☐ abuse/profanity path ☐ fallback
tiers → human handoff ☐ Petravex: never publish sensitive figures, defer pricing to a human.

**8 Eval/Observability** ☐ log every turn (intent, latency, outcome) ☐ containment/deflection
rate ☐ handoff rate + reasons ☐ fallback log reviewed weekly ☐ CSAT capture ☐ iteration loop
feeds new intents back to ai-agent-builder.

---

## HARD RULES
- **Architecture first, conversation second, implementation third.** This skill → ai-agent-builder
  → n8n-automation-builder.
- **Start with MVP layers (1,2,3,6,7).** Add Memory/RAG/Observability only when a real need
  forces it — every layer is cost + a failure mode.
- **Do NOT build RAG if the knowledge fits in the prompt.** RAG is for large/changing content.
- **Primary stack:** Interface = 360dialog WhatsApp Cloud API; Orchestration = n8n; Reasoning =
  Claude/OpenAI; Tools = ClickUp/Notion/CRM. Justify any deviation.
- **Guardrails are not optional** — every agent has scope limits, a no-hallucination rule, and
  a fallback → human handoff.
- **Credentials live in n8n credentials, never hardcoded.** Mind PII at the Memory + logging layers.
- **Every layer added must be justified out loud** in the architecture doc.
- Conversation design, persona, and handoff UX live in **ai-agent-builder** — don't duplicate
  them here; reference them.

## EXAMPLE TRIGGERS
- "اعمل architecture للـ agent تبع [client]" / "design the architecture for this agent"
- "شو الـ layers اللي بحتاجها" / "which agent layers do I need (MVP vs full)?"
- "بدنا RAG ولا لأ؟" / "do we need RAG for this bot?"
- "كيف نعمل memory للـ agent" / "add long-term memory to the agent"
- "vector store لأي client" / "set up a vector store for retrieval"
- "guardrails للبوت" / "what guardrails does this agent need"
- "كيف نقيس أداء الـ agent" / "observability + containment metrics for the agent"
