# Notatki sesji — FIT BRO AI OFFLINE

## Sesja 2 — 2026-04-19

### Co zostało zrobione

1. **Persystencja danych (AsyncStorage):**
   - `src/services/storage.ts` — zapis/odczyt profilu, historii treningów, czatu, timera, osobowości
   - Hydratacja store na starcie — dane użytkownika przeżywają restart aplikacji
   - Loading screen podczas wczytywania danych

2. **Serwis AI:**
   - `src/services/aiService.ts` — kompletna architektura z placeholder inference
   - System promptów dla 5 osobowości trenera (Arnold/Rocky/Instruktor/Zen/Custom)
   - Prompty w 3 językach (PL, DE, EN)
   - Kontekst użytkownika (profil, cel, poziom) wstrzykiwany do systemu
   - Placeholder odpowiedzi kontekstowe (trening/dieta/zdrowie)
   - Streaming tokenów do UI (symulowany)
   - Architektura gotowa na podpięcie llama.cpp / LiteRT-LM

3. **Nowe ekrany:**
   - `SettingsScreen` — profil z BMI, statystyki, wybór osobowości, język, reset
   - `ExerciseDetailScreen` — instrukcje krok po kroku, parametry, mięśnie, sprzęt

4. **Aktualizacje istniejących ekranów:**
   - `ChatScreen` — podłączony do AIService ze streamingiem, kursorowym efektem pisania
   - `ExercisesScreen` — klikanie na ćwiczenie otwiera szczegóły
   - `AppNavigator` — 5 tabów (+ Profil), loading screen, hydratacja

5. **Pobieranie modelu Gemma 4 E4B:**
   - Źródło: `unsloth/gemma-4-E4B-it-GGUF` z Hugging Face
   - Plik: `gemma-4-E4B-it-Q4_K_M.gguf` (~5 GB)
   - Status: **POBIERANIE TRWA W TLE** (process PID aktywny)
   - Lokalizacja: `/home/arek/fit-bro-ai-offline/models/`
   - **UWAGA**: Po pobraniu model będzie w `models/` ale jest w `.gitignore` (za duży na git)

6. **TypeScript: 0 błędów**
7. **Zainstalowane zależności:** `@react-native-async-storage/async-storage`

### Aktualny stan plików (łącznie sesja 1+2)

```
src/
├── config/theme.ts                    ✅ Motyw ciemny
├── i18n/{pl,de,en,index}.ts           ✅ Kompletne tłumaczenia
├── models/types.ts                    ✅ Pełny system typów
├── navigation/AppNavigator.tsx        ✅ Onboarding + 5 tabów + hydratacja
├── screens/
│   ├── OnboardingScreen.tsx           ✅ 3 slajdy
│   ├── DisclaimerScreen.tsx           ✅ MDR + AI Act
│   ├── ParqScreen.tsx                 ✅ 7 pytań
│   ├── ProfileSetupScreen.tsx         ✅ Formularz profilu
│   ├── HomeScreen.tsx                 ✅ Statystyki + szybki start
│   ├── ChatScreen.tsx                 ✅ Chat + streaming AI
│   ├── ExercisesScreen.tsx            ✅ Filtry + wyszukiwanie + szczegóły
│   ├── ExerciseDetailScreen.tsx       ✅ Instrukcje krok po kroku
│   ├── TimerScreen.tsx                ✅ Timer interwałowy
│   └── SettingsScreen.tsx             ✅ Profil + osobowość + język + reset
├── services/
│   ├── store.ts                       ✅ Zustand + persystencja
│   ├── storage.ts                     ✅ AsyncStorage wrapper
│   ├── aiService.ts                   ✅ Placeholder + architektura inference
│   └── exerciseData.ts                ✅ 16 ćwiczeń × 3 języki
```

### Co jest do zrobienia w następnej sesji

**Priorytet 1 — Integracja Gemma 4 E4B (na prawdziwym urządzeniu):**
- [ ] Sprawdzić czy model się pobrał (`/home/arek/fit-bro-ai-offline/models/gemma-4-E4B-it-Q4_K_M.gguf`)
- [ ] Zainstalować `react-native-llama` lub `llama.cpp` bindings
- [ ] `npx expo prebuild` — przejście na bare workflow (wymagane dla native modules)
- [ ] Podłączyć prawdziwy inference w `aiService.ts` (zamienić placeholder)
- [ ] Testować na urządzeniu mobilnym (min. 6 GB RAM)

**Priorytet 2 — Rozbudowa funkcjonalności:**
- [ ] Generowanie planów treningowych z AI (structured output JSON)
- [ ] Ekran aktywnego treningu (lista ćwiczeń z checkboxami, timer per ćwiczenie)
- [ ] Pose estimation (MediaPipe) — liczenie powtórzeń
- [ ] Animacje ćwiczeń (Lottie lub proste GIFy)

**Priorytet 3 — TTS/STT:**
- [ ] Piper TTS — głos trenera
- [ ] Whisper.cpp — rozpoznawanie mowy

**Priorytet 4 — Polish:**
- [ ] SafeAreaView na wszystkich ekranach
- [ ] Haptic feedback
- [ ] Skeleton loading
- [ ] Animacje przejść
- [ ] Dark/light mode toggle

### Znane problemy / uwagi
- Model Gemma 4 E4B (~5 GB) pobiera się do `models/` — jest w `.gitignore`
- Na laptopie (i5-3317U, 4GB RAM) nie uruchomisz emulatora — testuj na telefonie
- Expo Go nie obsłuży native modules (llama.cpp) — potrzebny `npx expo prebuild`
- Dwa procesy pobierania mogły się uruchomić — sprawdzić czy model nie jest uszkodzony (sprawdzić rozmiar ~5 GB)

### Decyzje do podjęcia
- Biblioteka llama.cpp dla React Native: `react-native-llama` (llama.rn) vs custom native module
- Kiedy przejść na bare workflow (`npx expo prebuild`)
- Czy potrzebujemy EAS Build czy local builds wystarczą na MVP

---

## Sesja 1 — 2026-04-19

### Co zostało zrobione
- Repozytorium GitHub: https://github.com/Arktoss98/fit-bro-ai-offline
- React Native 0.84 + Expo (blank-typescript)
- Motyw ciemny, i18n (PL/DE/EN), typy, Zustand store
- 7 ekranów: onboarding, disclaimer, PAR-Q, profil, home, chat, ćwiczenia, timer
- 16 ćwiczeń w 8 kategoriach
- Nawigacja tab (4 taby)
- 0 błędów TypeScript
