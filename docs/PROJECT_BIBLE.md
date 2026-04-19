# FIT BRO AI OFFLINE — Project Bible

Full strategic and technical document is maintained separately.
This file tracks key decisions and their rationale.

## Key Decisions Log

### 2026-04-19 — Project Initialized
- **Stack**: React Native 0.84 + Expo bare workflow
- **AI Model**: Gemma 4 E4B (Q4_K_M ~3.6 GB, Apache 2.0)
- **Runtime**: LiteRT-LM primary, llama.cpp fallback
- **Markets**: PL first (validation), then DACH
- **Monetization**: Hybrid (€24.99 one-time + €5.99/mo Premium AI)
- **Positioning**: Wellness only — NOT a medical device

## Architecture Principles

1. **Offline-first** — all AI inference on-device, no cloud dependency
2. **Privacy by design** — health data never leaves the phone
3. **Device-tier adaptive** — auto-select E2B for mid-range (6GB RAM), E4B for flagship
4. **Regulatory safe** — no medical claims, no ICD-10, no "diagnosis/therapy" language
5. **Lean MVP** — ship in 6 weeks, validate in PL, then expand
