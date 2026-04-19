# Notatki sesji — FIT BRO AI OFFLINE

## Sesja 1 — 2026-04-19

### Co zostało zrobione

1. **Repozytorium GitHub** — https://github.com/Arktoss98/fit-bro-ai-offline
2. **Inicjalizacja projektu** — React Native 0.84 + Expo (blank-typescript)
3. **Zainstalowane zależności:**
   - `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
   - `react-native-screens`, `react-native-safe-area-context`
   - `zustand` (state management)
   - `i18next`, `react-i18next`, `expo-localization` (internacjonalizacja)
   - `expo-haptics`, `expo-status-bar`

4. **Utworzone pliki:**
   - `src/config/theme.ts` — motyw ciemny (kolory, spacing, fonty, border-radius)
   - `src/models/types.ts` — pełny system typów (UserProfile, Exercise, Workout, Chat, Timer)
   - `src/i18n/` — kompletne tłumaczenia PL, DE, EN (onboarding, PAR-Q, disclaimer, profil, tabs, chat, ćwiczenia, timer, trener)
   - `src/services/store.ts` — Zustand store (profil, chat, sesje, historia, timer, AI status)
   - `src/services/exerciseData.ts` — 16 ćwiczeń w 8 kategoriach (PL/DE/EN)
   - `src/screens/OnboardingScreen.tsx` — 3 slajdy z paginacją
   - `src/screens/DisclaimerScreen.tsx` — disclaimer medyczny (MDR + AI Act)
   - `src/screens/ParqScreen.tsx` — 7 pytań PAR-Q z walidacją
   - `src/screens/ProfileSetupScreen.tsx` — imię, wiek, waga, wzrost, płeć, poziom, cel
   - `src/screens/HomeScreen.tsx` — statystyki, plan dnia, szybki start (4 typy)
   - `src/screens/ChatScreen.tsx` — chat UI z placeholder AI
   - `src/screens/ExercisesScreen.tsx` — wyszukiwanie, filtry kategorii, lista ćwiczeń
   - `src/screens/TimerScreen.tsx` — timer interwałowy (praca/odpoczynek/rundy)
   - `src/navigation/AppNavigator.tsx` — flow onboarding → main tabs
   - `docs/PROJECT_BIBLE.md` — kluczowe decyzje projektowe

5. **TypeScript kompiluje się bez błędów**

### Co jest do zrobienia w następnej sesji

**Priorytet 1 — Integracja AI (kluczowa funkcjonalność):**
- [ ] Zainstalować `react-native-executorch` lub zintegrować `llama.cpp` via native module
- [ ] Pobranie i załadowanie modelu Gemma 4 E4B (Q4_K_M, ~3,6 GB)
- [ ] Podłączenie chatu do prawdziwego inference
- [ ] System promptów dla osobowości trenera (Arnold/Rocky/Instruktor/Zen)
- [ ] Streaming odpowiedzi (token by token)

**Priorytet 2 — Persystencja:**
- [ ] SQLCipher lub AsyncStorage dla danych użytkownika
- [ ] Zapisywanie profilu, historii treningów, wiadomości czatu
- [ ] Zachowanie stanu po zamknięciu aplikacji

**Priorytet 3 — Rozbudowa funkcjonalności:**
- [ ] Ekran szczegółów ćwiczenia (instrukcje krok po kroku, animacja)
- [ ] Generowanie planów treningowych z AI
- [ ] Pose estimation (MediaPipe) — liczenie powtórzeń
- [ ] Ekran profilu/ustawień (zmiana osobowości trenera, język, dane)

**Priorytet 4 — TTS/STT:**
- [ ] Piper TTS — głos trenera (PL: gosia/darkman, DE: thorsten, EN: amy)
- [ ] Whisper.cpp — rozpoznawanie mowy (hands-free trening)

**Priorytet 5 — Polish i UX:**
- [ ] Animacje przejść między ekranami
- [ ] Haptic feedback na interakcjach
- [ ] Skeleton loading states
- [ ] Obsługa błędów i edge cases

### Znane problemy / uwagi
- Gałąź `master` istnieje lokalnie obok `main` — można ją usunąć (`git branch -d master`)
- Expo bare workflow wymaga `npx expo prebuild` przed budowaniem natywnym
- Na tym laptopie (i5-3317U, 4GB RAM) nie uruchomisz emulatora Android — testuj na prawdziwym urządzeniu przez Expo Go lub na innej maszynie
- Model Gemma 4 E4B wymaga ~3 GB RAM na telefonie — testuj na urządzeniu z ≥6 GB RAM

### Decyzje do podjęcia
- Czy używamy `react-native-executorch` (oficjalny, ale może nie mieć day-0 Gemma 4 support) czy `llama.cpp` bindings?
- Czy robimy prebuild natywny teraz czy zostajemy w Expo Go dopóki to możliwe?
- Nazwa — "FIT BRO" zostaje na MVP czy rebrandujemy wcześniej?
