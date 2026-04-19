# FIT BRO AI OFFLINE — Instrukcje dla Claude Code

## Projekt
Offline'owy AI personal trainer na iOS/Android. Model Gemma 4 E4B działa on-device.

## Stack
- React Native 0.84 + Expo bare workflow (TypeScript)
- Zustand (state), AsyncStorage (persystencja)
- i18next (PL, DE, EN)
- llama.cpp / LiteRT-LM (AI inference — w trakcie integracji)

## Zasady
- Dokumentacja i komentarze **po polsku**
- Nazwy zmiennych/funkcji **po angielsku**
- Ciemny motyw (COLORS z `src/config/theme.ts`)
- Ścisłe pozycjonowanie **wellness** — NIGDY nie używaj słów: diagnoza, terapia, leczenie, wyrób medyczny
- Model AI działa offline — zero zależności od chmury w runtime
- Minimum iOS 16 (A15), Android API 26

## Kluczowe pliki
- `src/services/aiService.ts` — serwis AI (placeholder, do podłączenia llama.cpp)
- `src/services/store.ts` — Zustand store z persystencją
- `src/services/exerciseData.ts` — biblioteka ćwiczeń (PL/DE/EN)
- `src/config/theme.ts` — kolory, spacing, typografia
- `docs/SESSION_NOTES.md` — co zrobiono i co dalej

## Przed końcem sesji
Zawsze zaktualizuj `docs/SESSION_NOTES.md` z postępem i planem na następną sesję.
