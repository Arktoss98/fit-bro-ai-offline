# Notatki sesji — FIT BRO AI OFFLINE

## Sesja 2 — 2026-04-19 (kontynuacja)

### Co zostało zrobione

1. **Persystencja danych (AsyncStorage):**
   - `src/services/storage.ts` — zapis/odczyt profilu, historii treningów, czatu, timera, osobowości
   - Hydratacja store na starcie — dane przeżywają restart aplikacji
   - Loading screen podczas wczytywania

2. **Serwis AI (kompletna architektura):**
   - `src/services/aiService.ts` — placeholder inference z pełną architekturą
   - 5 osobowości trenera (Arnold/Rocky/Instruktor/Zen/Custom) × 3 języki
   - Kontekst użytkownika (profil, cel, poziom) wstrzykiwany do promptów
   - Placeholder odpowiedzi kontekstowe (trening/dieta/zdrowie)
   - Streaming tokenów do UI
   - Gotowe na podpięcie llama.cpp

3. **Nowe ekrany:**
   - `SettingsScreen` — profil z BMI, statystyki, osobowość, język, reset
   - `ExerciseDetailScreen` — instrukcje krok po kroku, parametry, mięśnie
   - `ActiveWorkoutScreen` — pełny flow treningu:
     - Ekran gotowości → start → serie z odpoczynkami → podsumowanie
     - Timer per seria, wibracje, pasek postępu
     - Zapis ukończonego treningu do historii

4. **Rozbudowa istniejących:**
   - `HomeScreen` — szybki start uruchamia trening, streak, motywacja
   - `ExercisesScreen` — klikanie otwiera szczegóły
   - `AppNavigator` — 5 tabów, loading screen, hydratacja
   - Biblioteka ćwiczeń: **30 ćwiczeń** w 8 kategoriach × 3 języki

5. **Konfiguracja:**
   - `app.json` — dark theme, bundle IDs, uprawnienia, scheme URL
   - `CLAUDE.md` — instrukcje dla przyszłych sesji

6. **Pobieranie modelu Gemma 4 E4B:**
   - Źródło: `unsloth/gemma-4-E4B-it-GGUF` (Hugging Face)
   - Plik: `gemma-4-E4B-it-Q4_K_M.gguf` (~5 GB)
   - Status: **POBIERANIE TRWA W TLE** (wget, ~10 MB/s)
   - Lokalizacja: `/home/arek/fit-bro-ai-offline/models/gemma-4-E4B-it-Q4_K_M.gguf`
   - Komenda sprawdzenia: `ls -lah /home/arek/fit-bro-ai-offline/models/*.gguf`
   - **UWAGA**: huggingface-hub xet transfer nie działa na tym laptopie (4 GB RAM), wget działa OK

7. **TypeScript: 0 błędów** (po każdej zmianie)

### Aktualny stan plików

```
src/
├── config/theme.ts                    ✅ Motyw ciemny
├── i18n/{pl,de,en,index}.ts           ✅ Kompletne tłumaczenia
├── models/types.ts                    ✅ System typów
├── navigation/AppNavigator.tsx        ✅ 5 tabów + hydratacja + loading
├── screens/
│   ├── OnboardingScreen.tsx           ✅ 3 slajdy
│   ├── DisclaimerScreen.tsx           ✅ MDR + AI Act
│   ├── ParqScreen.tsx                 ✅ 7 pytań PAR-Q
│   ├── ProfileSetupScreen.tsx         ✅ Formularz profilu
│   ├── HomeScreen.tsx                 ✅ Statystyki + streak + szybki start → trening
│   ├── ChatScreen.tsx                 ✅ Chat + streaming AI
│   ├── ExercisesScreen.tsx            ✅ 30 ćwiczeń + filtry + szczegóły
│   ├── ExerciseDetailScreen.tsx       ✅ Instrukcje krok po kroku
│   ├── ActiveWorkoutScreen.tsx        ✅ Pełny flow treningu
│   ├── TimerScreen.tsx                ✅ Timer interwałowy
│   └── SettingsScreen.tsx             ✅ Profil + osobowość + język + reset
├── services/
│   ├── store.ts                       ✅ Zustand + AsyncStorage
│   ├── storage.ts                     ✅ Persystencja
│   ├── aiService.ts                   ✅ Placeholder + architektura
│   └── exerciseData.ts                ✅ 30 ćwiczeń × 3 języki
```

### Następna sesja — priorytety

**Priorytet 1 — Integracja Gemma 4 E4B:**
- [x] Model pobrany! `~/fit-bro-ai-offline/models/gemma-4-E4B-it-Q4_K_M.gguf` (4,98 GB)
- [x] llama.cpp skompilowany: `~/llama.cpp/build/bin/llama-cli`
- [x] Model przetestowany — generuje odpowiedzi po polsku w stylu Arnolda (~1,7 t/s na i5-3317U)
- [x] Thinking mode Gemma 4 — wymaga `<think></think>` w prompcie, ale i tak generuje chain-of-thought
- [ ] `npx expo prebuild` (bare workflow, wymagane dla native modules)
- [ ] Zainstalować `llama.rn` (react-native-llama) — bindingil llama.cpp
- [ ] Podłączyć prawdziwy inference w `aiService.ts`
- [ ] Testować na urządzeniu mobilnym (min. 6 GB RAM)

**Priorytet 2 — Generowanie planów AI:**
- [ ] Structured output JSON (constrained decoding) dla planów treningowych
- [ ] Generowanie planu na podstawie profilu użytkownika i historii
- [ ] Wyświetlanie wygenerowanego planu w HomeScreen

**Priorytet 3 — Pose Estimation:**
- [ ] Zainstalować `react-native-mediapipe` lub `expo-camera` + MediaPipe
- [ ] Liczenie powtórzeń na podstawie kątów stawów
- [ ] Overlay na kamerze z landmarkami

**Priorytet 4 — TTS/STT:**
- [ ] Piper TTS — głos trenera (PL/DE/EN)
- [ ] Whisper.cpp — rozpoznawanie mowy (hands-free)

**Priorytet 5 — Polish i UX:**
- [ ] SafeAreaView konsekwentnie
- [ ] Animacje (react-native-reanimated)
- [ ] Haptic feedback
- [ ] Ikony zamiast emoji w tab barze

### Wnioski z testu modelu na laptopie
- **Model działa** na i5-3317U/4GB RAM przez mmap + swap
- **Prędkość**: prefill ~2,4 t/s, generation ~1,7 t/s — za wolno na UX, ale działa
- **Problem**: Gemma 4 E4B-it ma "konfigurowalny thinking mode" ale ZAWSZE generuje chain-of-thought nawet z pustym `<think></think>`. Zużywa ~300-500 tokenów na myślenie przed odpowiedzią
- **Rozwiązanie na telefonie**: na SD 8 Gen 3 / A17 Pro będzie 15-30 t/s — thinking + odpowiedź w ~15s
- **Rozwiązanie na laptopie**: użyć mniejszego modelu E2B (~2,5 GB) lub Gemma 4 E4B bez thinking (jeśli Google udostępni wariant)
- **llama.cpp**: skompilowany w `~/llama.cpp/build/bin/llama-cli`, działa z GGUF

### Uwagi techniczne
- Laptop: Wortmann i5-3317U, 4 GB RAM, Ubuntu 24.04 — za mało na emulator
- Node 20.20.2, Expo SDK latest, React Native 0.84
- GitHub: https://github.com/Arktoss98/fit-bro-ai-offline
- Konto GitHub: Arktoss98
- huggingface-hub zainstalowany (`~/.local/bin/huggingface-cli`)
- Na tym laptopie xet transfer (HF) zjada za dużo RAM — używać wget do pobierania modeli

---

## Sesja 1 — 2026-04-19 (skrót)
Inicjalizacja repo, React Native + Expo, 7 ekranów, 16 ćwiczeń, i18n, timer, nawigacja.
