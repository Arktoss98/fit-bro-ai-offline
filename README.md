# FIT BRO AI OFFLINE

**Offline'owy AI Personal Trainer** — pierwszy mainstreamowy trener fitness działający w pełni na urządzeniu z modelem Gemma 4 E4B. Bez chmury, bez subskrypcji na serwery, pełna prywatność.

## Czym jest ta aplikacja?

FIT BRO AI OFFLINE łączy role trenera personalnego, dietetyka, asystenta rehabilitacji i content creatora — wszystko działa lokalnie na Twoim telefonie. Cały inference AI odbywa się on-device (~3,6 GB model), co daje:

- **Pełną prywatność** — dane zdrowotne nigdy nie opuszczają urządzenia
- **Zerowe koszty chmury** — brak serwerów, brak kosztów operacyjnych per user
- **Działanie wszędzie** — góry, metro, samolot, brak zasięgu

## Rynki docelowe

- **Główny:** DACH (Niemcy, Austria, Szwajcaria) + Polska
- **Języki:** DE (główny), PL, EN
- **Użytkownicy:** Początkujący do zaawansowanych (0-100 poziom fitness)

## Stack techniczny

| Komponent | Technologia |
|---|---|
| **Framework mobilny** | React Native 0.84 + Expo (bare workflow) |
| **Model AI** | Gemma 4 E4B (Q4_K_M, ~3,6 GB) |
| **Runtime AI** | LiteRT-LM (primary) / llama.cpp (fallback) |
| **Pose estimation** | MediaPipe Pose Landmarker (33 landmarki 3D) |
| **Text-to-Speech** | Piper TTS (PL/DE/EN, ~60 MB/głos) |
| **Speech-to-Text** | Whisper.cpp base multilingual Q5_0 (~60 MB) |
| **Baza lokalna** | SQLCipher (AES-256) |
| **Stan aplikacji** | Zustand |
| **Nawigacja** | React Navigation v7 |
| **Internacjonalizacja** | i18next + react-i18next |

## Zakres MVP (6 tygodni)

- [x] Setup projektu i architektura
- [x] Konfiguracja i18n (PL, DE, EN)
- [x] System typów i modeli danych
- [x] Store (Zustand) — profil, chat, sesje, timer
- [x] Ekran onboardingu (3 slajdy)
- [x] Ekran disclaimera medycznego (Art. 50 AI Act)
- [x] Kwestionariusz PAR-Q (7 pytań)
- [x] Ekran konfiguracji profilu
- [x] Ekran główny (statystyki, plan dnia, szybki start)
- [x] Ekran czatu z trenerem AI (placeholder)
- [x] Biblioteka ćwiczeń (16 ćwiczeń, 8 kategorii, wyszukiwanie + filtry)
- [x] Timer treningowy (interwałowy, praca/odpoczynek/rundy)
- [x] Nawigacja tab (Start, Trener AI, Ćwiczenia, Timer)
- [ ] Integracja Gemma 4 E4B (on-device inference)
- [ ] Pose estimation (MediaPipe) — liczenie powtórzeń
- [ ] Osobowość trenera (Schwarzenegger/Rocky/Instruktor/Zen/Custom)
- [ ] Persystencja danych (SQLCipher)
- [ ] TTS/STT (Piper + Whisper.cpp)

## Roadmapa

### Etap 1 — MVP (Tygodnie 1-6)
Trener fitness AI z konwersacją, biblioteka ćwiczeń, timer, pose estimation, personalizacja osobowości.

### Etap 2 — Dieta i rehabilitacja (Tygodnie 7-22)
Plany dietetyczne, skan lodówki (multimodal vision), estymacja kalorii ze zdjęć, moduł rehabilitacji, integracja Bluetooth (Apple Health, Google Fit, Garmin, Polar).

### Etap 3 — Content i społeczność (Tygodnie 23-28)
Content creator (overlay statystyk, efekty), analiza tras 3D, integracja muzyki, funkcje społecznościowe.

## Monetyzacja

| Tier | Cena (DACH) | Cena (PL) | Funkcje |
|---|---|---|---|
| **Free** | Darmowy | Darmowy | Podstawowe AI treningi, 50+ ćwiczeń, plan 7-dniowy |
| **Premium** (jednorazowo) | €24,99 | 89 PLN | Pełna biblioteka 200+, eksport PDF, bez reklam |
| **Premium AI** (subskrypcja) | €5,99/mc lub €49,99/rok | 19,99 PLN/mc lub 179 PLN/rok | Adaptive coaching, personalizowane plany, analiza postępów, sync HealthKit |

14-dniowy darmowy trial na Premium AI.

## Wymagania urządzeń

| Zasób | Minimum | Rekomendowane |
|---|---|---|
| RAM | 6 GB | 8 GB+ |
| Storage | ~6 GB wolne | 8 GB+ wolne |
| iOS | 16+ (A15 Bionic) | 17+ (A17 Pro+) |
| Android | API 26+ | API 33+ (SD 8 Gen 3+) |

## Struktura projektu

```
fit-bro-ai-offline/
├── src/
│   ├── components/       # Komponenty UI wielokrotnego użytku
│   ├── screens/          # Ekrany aplikacji
│   ├── services/         # Silnik AI, baza danych, integracje
│   ├── models/           # Modele danych i typy
│   ├── utils/            # Helpery i stałe
│   ├── assets/           # Animacje, dźwięki, ikony
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Konfiguracja nawigacji
│   ├── config/           # Konfiguracja aplikacji (theme, stałe)
│   └── i18n/             # Internacjonalizacja (DE, PL, EN)
├── docs/                 # Dokumentacja
├── tests/                # Testy
├── app.json              # Konfiguracja Expo
└── package.json
```

## Compliance

- **MDR 2017/745**: Ścisłe pozycjonowanie wellness — NIE wyrób medyczny
- **EU AI Act**: Limited Risk (obowiązek transparentności Art. 50)
- **GDPR/DSGVO/RODO**: Przetwarzanie on-device, explicit consent, DPIA
- **PLD 2024/2853**: Obowiązuje od XII/2026

## Uruchomienie

```bash
# Zainstaluj zależności
npm install

# Uruchom dev server
npx expo start

# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Licencja

Proprietary. Wszelkie prawa zastrzeżone.

---

Zbudowane z Gemma 4 E4B (Apache 2.0) | React Native | MediaPipe | Piper TTS | Whisper.cpp
