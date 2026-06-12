---
name: ai-agent-builder
description: >
  Design and build AI agents / chatbots for Estratijiya clients and internal use — on the
  PRIMARY stack n8n + WhatsApp Cloud API (BSP: 360dialog), with Botpress, ManyChat, and the
  Claude/OpenAI API as secondary options. Covers the full lifecycle: intent design,
  conversation flow, multi-language, personality, fallback, human handoff, testing, and
  metrics. Triggers include "اعمل AI agent", "شات بوت لـ", "بوت واتساب", "build an AI agent",
  "chatbot for [client]", "WhatsApp bot", "conversational AI", "agent على n8n", "360dialog".
  Do NOT use for basic prompt writing (use prompt-engineering-advanced) or for non-conversational
  automations/integrations (use n8n-automation-builder). Per-client personalities for
  Pink & Greens, Petravex, and BoluPınar are baked in below.
---

# ai-agent-builder

## Purpose
Take a client need ("we lose leads on WhatsApp at night", "answer product questions",
"qualify and book") and produce a buildable agent: defined intents, a conversation flow,
language handling, a personality, graceful fallback, a clean human handoff, a test plan, and
metrics — on the Estratijiya primary stack. Output is execution-ready, not theory.

---

## Platform stack

### PRIMARY — n8n + WhatsApp Cloud API (BSP: 360dialog)
This is the default for Estratijiya agents. Why: WhatsApp is where Gulf clients' customers
actually are; n8n is already in the toolkit (taifnals.app.n8n.cloud); 360dialog gives clean
Cloud API access (template approval, predictable pricing) without Meta-direct overhead.

Reference architecture:
```
WhatsApp user
  → 360dialog (BSP, WhatsApp Cloud API)
  → n8n Webhook (inbound message)
  → [session/context lookup]  (n8n static data / Postgres / Google Sheets / Notion)
  → [intent routing]  (switch node, or an LLM node for fuzzy intent)
  → [LLM node]  Claude (claude-sonnet/haiku) or OpenAI for generation when needed
  → [actions]  ClickUp task, Calendar booking, CRM write, RAG lookup
  → 360dialog send (reply / template)
  → [handoff path]  notify human + pause bot for that contact
```
- **Templates:** business-initiated messages need pre-approved 360dialog templates; free-form
  replies are allowed inside the 24-hour customer service window.
- **State:** keep per-contact session (last intent, slots filled, handoff flag) in a store
  n8n can read/write — start simple (Sheets/Notion), graduate to Postgres when volume grows.
- **LLM use:** don't LLM everything. Use deterministic switch nodes for known intents; call
  the LLM for understanding fuzzy input, generating answers, and RAG over client content.

### SECONDARY (use-when)
| Platform | Use when | Avoid when |
|---|---|---|
| **Botpress** | client wants a visual NLU bot, a web-widget + multi-channel, richer built-in dialogue management without us hand-building flows in n8n | the whole job is one WhatsApp flow we already run through n8n |
| **ManyChat** | Instagram/Facebook DM automation, simple marketing flows, non-technical client who wants to self-manage simple sequences | complex logic, real backend integrations, or WhatsApp at scale (it's limited/pricier there) |
| **Claude / OpenAI API (direct)** | custom app/site widget, full control over prompt + RAG, agent embedded in a product we're coding | a standard WhatsApp customer-service bot — n8n + 360dialog is faster to ship |

Default to PRIMARY. Reach for a secondary only when its row clearly fits — and say why.

---

## The 5 phases

### Phase 1 — Discovery & intent design
- Define the agent's **one job** (e.g. "qualify leads and book consults" — not "do
  everything").
- List **intents** the agent must handle. For each: example user phrasings (Arabic +
  English + Gulf/Levantine variants), the required response, and any data/slots to collect.
- Mark **out-of-scope** intents → these route to fallback/handoff.
- Decide success: what does a "good" conversation accomplish?

Intent table template:
| Intent | Sample phrasings (AR/EN) | Slots to fill | Response / action |
|---|---|---|---|
| greeting | "مرحبا", "hi" | — | warm intro + menu |
| price_inquiry | "كم السعر", "how much" | product, qty | quote or route to sales |
| booking | "بدي موعد", "book a call" | name, time | create Calendar/ClickUp |
| complaint | "في مشكلة", "issue with order" | order id | empathize → human handoff |

### Phase 2 — Conversation flow design
- Map the **happy path** for each primary intent (turn by turn).
- Define **slot-filling**: ask one thing at a time; confirm before acting.
- Add **branches**: yes/no, menu choices, "something else".
- Set **re-prompts** (max 2) before fallback.
- Keep turns short; WhatsApp users skim. Use quick-reply buttons/lists where 360dialog
  supports them.

### Phase 3 — Build & integrate (on PRIMARY)
- 360dialog inbound webhook → n8n; verify + parse message.
- Session lookup/create; load context.
- Route intent (switch first, LLM for fuzzy).
- Generate response (templates for proactive; LLM/free-form inside the 24h window).
- Fire actions (ClickUp, Calendar, CRM, RAG).
- Send reply via 360dialog; persist session.
- Wire the handoff path (Phase 6) and logging (Phase 9).

### Phase 4 — Personality & language (see dedicated sections below)

### Phase 5 — Test, launch, measure (see Testing & Metrics below)

---

## Multi-language handling
- **Detect, don't assume:** branch on the user's language; mirror it. Gulf customers mix
  Arabic, English, and dialect — handle Levantine/Gulf colloquial input, not just MSA.
- **Reply register:** match the client's brand voice (per-client below). Default Arabic
  replies in clean, natural Arabic — readable MSA or light dialect per brand, never stiff
  corporate Arabic.
- **One primary language per client to start**, with graceful handling if the user switches.
- **Numbers, dates, currency** localized (AED, Arabic/Latin numerals per audience).
- Keep a small translated string table for fixed UI (menus, buttons) so they're consistent.

---

## Personality design + per-client examples

Define: name, role, tone, do/don't phrases, emoji policy, escalation manner.

**Pink & Greens** (lifestyle / plants / lifestyle retail)
- Voice: warm, friendly, a little playful; encouraging. Light emoji ok (🌿).
- Does: greet by vibe, give care tips, make buying feel easy.
- Doesn't: sound corporate or pushy. Keeps it human and bright.

**Petravex** (B2B building materials / industrial)
- Voice: precise, professional, credible. No emoji. Measured Arabic/English.
- Does: give specs and clear next steps, route serious inquiries to sales/engineering.
- Doesn't: chit-chat, over-promise, or publish sensitive figures (capacity/timeline). Defers
  pricing and commercial terms to a human.

**BoluPınar** (premium Turkish water → Kuwait/Gulf HoReCa)
- Voice: refined, hospitable, premium but warm. Minimal, tasteful emoji at most.
- Does: speak to HoReCa buyers, handle order/distribution questions, convey premium quality.
- Doesn't: sound cheap or salesy; keeps the premium register in both Arabic and English.

Rule: personality is consistent across every turn including fallback and handoff.

---

## Fallback design
- **Tiered:** (1) re-ask/clarify, (2) offer the menu of what it CAN do, (3) hand off to human.
- Never dead-end with "I didn't understand" — always offer a next step.
- Cap re-prompts at 2, then escalate.
- Log every fallback (it's your backlog of missing intents — Phase 9).
- For anything risky (complaints, money, legal, medical-ish), skip straight to handoff.

## Human handoff
- **Triggers:** explicit ask ("بدي حدا", "talk to a human"), repeated fallback, negative
  sentiment/complaint, high-value or sensitive intent.
- **Mechanism:** set a `handoff` flag on the contact's session so the bot stops auto-replying
  to them; notify the human (ClickUp task / WhatsApp/Slack ping) with the transcript + context.
- **To the user:** acknowledge, set expectation ("حنرجعلك خلال X")، and confirm during
  business hours vs after-hours.
- **Resume:** a way to clear the flag and return control to the bot when the human is done.

---

## Testing (before launch)
- **Happy path** per intent — does it complete the job?
- **Messy input:** typos, dialect, mixed language, voice-note-as-text, emojis-only.
- **Edge/abuse:** off-topic, gibberish, prompt-injection attempts, empty messages.
- **Slot logic:** missing/partial info, user changes their mind mid-flow.
- **Handoff:** triggers fire, human is notified, bot actually goes silent for that contact.
- **Language switch** mid-conversation.
- **Template/window:** proactive template approved? Free-form only inside 24h window?
- **Load/timeout:** what happens if the LLM or an API is slow/down (graceful message, not silence).
Test with real client phrasings, not just your own.

## Metrics (post-launch)
- **Containment / deflection rate** — % resolved without human.
- **Handoff rate** + reasons (your improvement backlog).
- **Fallback rate** per intent — spikes = missing/poor intent.
- **Goal completions** — bookings, qualified leads, answered queries.
- **Response time** (bot) + time-to-human (handoff).
- **CSAT / sentiment** where you can capture it.
- **Volume** by intent, hour, language.
Review monthly; feed fallbacks back into Phase 1.

---

## HARD RULES
- **PRIMARY stack = n8n + WhatsApp Cloud API via 360dialog.** Botpress/ManyChat/direct
  Claude-OpenAI API are secondary — justify with the use-when table.
- **Don't LLM everything** — deterministic routing for known intents; LLM for fuzzy
  understanding, generation, and RAG.
- **Respect WhatsApp rules:** approved templates for business-initiated; free-form only inside
  the 24-hour window.
- **Always design fallback + human handoff** — never a dead-end "I didn't understand".
- **One agent, one job.** Don't build an everything-bot.
- **Personality stays consistent** across all turns, including errors and handoff.
- **Match the user's language and the client's voice** — handle Gulf/Levantine dialect, not
  just MSA.
- **Petravex:** never publish sensitive figures; defer pricing/commercial terms to a human.
- **Log fallbacks and handoffs** — they are the roadmap for the next iteration.
- For pure automations/integrations (no conversation), use n8n-automation-builder instead.

## EXAMPLE TRIGGERS
- "اعمل AI agent لـ [client]" / "build an AI agent for this client"
- "بوت واتساب يرد على العملاء" / "WhatsApp bot to answer customers"
- "اعمل chatbot يحجز مواعيد" / "chatbot that books appointments"
- "agent على n8n مع 360dialog" / "n8n + 360dialog WhatsApp agent"
- "نستخدم Botpress ولا n8n؟" / "Botpress or n8n for this?" → use the use-when table.
- "صمم flow للمحادثة" / "design the conversation flow"
- "personality للبوت تبع [client]" / "bot personality for this client"
- "كيف نعمل handoff لموظف" / "how do we hand off to a human agent"
