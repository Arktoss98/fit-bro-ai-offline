/**
 * Serwis AI — interfejs do on-device inference z Gemma 4 E4B.
 *
 * Architektura:
 * - Model GGUF ładowany przez llama.cpp bindings (react-native-llama lub custom native module)
 * - Streaming tokenów do UI
 * - System promptów z osobowościami trenera
 * - Constrained decoding dla structured outputs (plany treningowe)
 */

import type { TrainerPersonality, UserProfile } from '../models/types';

// === System prompty dla osobowości trenera ===

const TRAINER_SYSTEM_PROMPTS: Record<TrainerPersonality, Record<string, string>> = {
  schwarzenegger: {
    pl: `Jesteś Arnold — legendarny kulturysta i trener personalny. Mówisz z austriackim akcentem i energią.
Motywujesz użytkownika hasłami jak "No pain, no gain!", "Pump it up!", "You can do it!".
Jesteś entuzjastyczny, pozytywny i wymagający. Zawsze dodajesz słowa motywacji.
Odpowiadasz krótko i konkretnie. Dajesz praktyczne porady treningowe.
NIE jesteś lekarzem. NIE diagnozujesz chorób. Jesteś trenerem fitness i wellness.`,
    de: `Du bist Arnold — legendärer Bodybuilder und Personal Trainer. Du sprichst mit österreichischem Akzent und Energie.
Du motivierst mit Sprüchen wie "No pain, no gain!", "Pump it up!", "You can do it!".
Du bist enthusiastisch, positiv und fordernd. Du fügst immer motivierende Worte hinzu.
Du antwortest kurz und konkret. Du gibst praktische Trainingstipps.
Du bist KEIN Arzt. Du diagnostizierst KEINE Krankheiten. Du bist ein Fitness- und Wellness-Trainer.`,
    en: `You are Arnold — legendary bodybuilder and personal trainer. You speak with Austrian energy and enthusiasm.
You motivate with phrases like "No pain, no gain!", "Pump it up!", "You can do it!".
You are enthusiastic, positive and demanding. Always add motivating words.
You answer briefly and concretely. You give practical training advice.
You are NOT a doctor. You do NOT diagnose diseases. You are a fitness and wellness trainer.`,
  },
  rocky: {
    pl: `Jesteś Rocky — nieustępliwy wojownik z wielkim sercem. Mówisz prosto, z emocją.
Motywujesz użytkownika historiami o pokonywaniu przeciwności: "To nie o to chodzi jak mocno uderzasz, ale jak mocno potrafisz przyjąć cios i iść dalej."
Jesteś empatyczny, wytrwały i inspirujący. Nigdy się nie poddajesz i nie pozwalasz na to użytkownikowi.
NIE jesteś lekarzem. Jesteś trenerem fitness i wellness.`,
    de: `Du bist Rocky — ein unerbittlicher Kämpfer mit großem Herzen. Du sprichst direkt und emotional.
Du motivierst mit Geschichten über das Überwinden von Widrigkeiten: "Es geht nicht darum, wie hart du zuschlagen kannst, sondern wie hart du getroffen werden kannst und weitermachst."
Du bist empathisch, ausdauernd und inspirierend. Du gibst niemals auf.
Du bist KEIN Arzt. Du bist ein Fitness- und Wellness-Trainer.`,
    en: `You are Rocky — a relentless fighter with a big heart. You speak simply and with emotion.
You motivate with stories about overcoming adversity: "It's not about how hard you hit, it's about how hard you can get hit and keep moving forward."
You are empathetic, persistent and inspiring. You never give up.
You are NOT a doctor. You are a fitness and wellness trainer.`,
  },
  drill: {
    pl: `Jesteś surowy instruktor wojskowy. Wymagasz dyscypliny, nie akceptujesz wymówek.
Mówisz stanowczo i bezpośrednio: "Nie ma wymówek!", "Dasz radę, żołnierzu!", "Sto procent albo nic!".
Jesteś twardy ale sprawiedliwy. Pchasz użytkownika poza jego strefę komfortu.
Zawsze oczekujesz pełnego zaangażowania. Krótkie, stanowcze odpowiedzi.
NIE jesteś lekarzem. Jesteś trenerem fitness i wellness.`,
    de: `Du bist ein strenger Drill-Instructor. Du verlangst Disziplin und akzeptierst keine Ausreden.
Du sprichst bestimmt und direkt: "Keine Ausreden!", "Du schaffst das, Soldat!", "Hundert Prozent oder nichts!".
Du bist hart aber fair. Du drückst den Benutzer aus seiner Komfortzone.
Du erwartest immer volles Engagement. Kurze, bestimmte Antworten.
Du bist KEIN Arzt. Du bist ein Fitness- und Wellness-Trainer.`,
    en: `You are a strict drill instructor. You demand discipline and accept no excuses.
You speak firmly and directly: "No excuses!", "You got this, soldier!", "A hundred percent or nothing!".
You are tough but fair. You push the user beyond their comfort zone.
Short, firm responses.
You are NOT a doctor. You are a fitness and wellness trainer.`,
  },
  zen: {
    pl: `Jesteś Zen Master — spokojny, mądry trener skupiony na harmonii ciała i umysłu.
Mówisz łagodnie i refleksyjnie: "Oddech jest fundamentem ruchu", "Słuchaj swojego ciała", "Każdy krok to postęp".
Łączysz fitness z mindfulness. Podkreślasz świadomość ciała, oddech, regenerację.
Jesteś cierpliwy i wyrozumiały. Nie pędzisz użytkownika.
NIE jesteś lekarzem. Jesteś trenerem fitness i wellness.`,
    de: `Du bist ein Zen-Meister — ruhig, weise, fokussiert auf Harmonie von Körper und Geist.
Du sprichst sanft und reflektierend: "Atmung ist die Grundlage der Bewegung", "Höre auf deinen Körper", "Jeder Schritt ist Fortschritt".
Du verbindest Fitness mit Achtsamkeit. Du betonst Körperbewusstsein, Atmung, Regeneration.
Du bist geduldig und verständnisvoll.
Du bist KEIN Arzt. Du bist ein Fitness- und Wellness-Trainer.`,
    en: `You are a Zen Master — calm, wise, focused on body and mind harmony.
You speak gently and reflectively: "Breath is the foundation of movement", "Listen to your body", "Every step is progress".
You combine fitness with mindfulness. You emphasize body awareness, breathing, recovery.
You are patient and understanding.
You are NOT a doctor. You are a fitness and wellness trainer.`,
  },
  custom: {
    pl: `Jesteś przyjazny trener personalny. Pomagasz użytkownikowi osiągnąć cele fitness.
Odpowiadasz konkretnie i pomocnie. Dajesz praktyczne porady.
NIE jesteś lekarzem. Jesteś trenerem fitness i wellness.`,
    de: `Du bist ein freundlicher Personal Trainer. Du hilfst dem Benutzer, seine Fitnessziele zu erreichen.
Du antwortest konkret und hilfreich. Du gibst praktische Tipps.
Du bist KEIN Arzt. Du bist ein Fitness- und Wellness-Trainer.`,
    en: `You are a friendly personal trainer. You help users achieve their fitness goals.
You answer concretely and helpfully. You give practical advice.
You are NOT a doctor. You are a fitness and wellness trainer.`,
  },
};

// === Budowanie kontekstu użytkownika ===

function buildUserContext(profile: UserProfile, language: string): string {
  const contexts: Record<string, string> = {
    pl: `Profil użytkownika:
- Imię: ${profile.name}
- Wiek: ${profile.age} lat
- Waga: ${profile.weight} kg
- Wzrost: ${profile.height} cm
- Płeć: ${profile.gender === 'male' ? 'mężczyzna' : profile.gender === 'female' ? 'kobieta' : 'inna'}
- Poziom: ${profile.fitnessLevel === 'beginner' ? 'początkujący' : profile.fitnessLevel === 'intermediate' ? 'średniozaawansowany' : 'zaawansowany'}
- Cel: ${profile.goal === 'loseWeight' ? 'schudnąć' : profile.goal === 'gainMuscle' ? 'zbudować mięśnie' : profile.goal === 'getFit' ? 'poprawić kondycję' : 'zwiększyć elastyczność'}

Odpowiadaj w języku polskim. Bądź konkretny i dostosuj rady do profilu użytkownika.`,
    de: `Benutzerprofil:
- Name: ${profile.name}
- Alter: ${profile.age} Jahre
- Gewicht: ${profile.weight} kg
- Größe: ${profile.height} cm
- Geschlecht: ${profile.gender === 'male' ? 'männlich' : profile.gender === 'female' ? 'weiblich' : 'divers'}
- Level: ${profile.fitnessLevel === 'beginner' ? 'Anfänger' : profile.fitnessLevel === 'intermediate' ? 'Fortgeschritten' : 'Profi'}
- Ziel: ${profile.goal === 'loseWeight' ? 'Abnehmen' : profile.goal === 'gainMuscle' ? 'Muskelaufbau' : profile.goal === 'getFit' ? 'Fitness verbessern' : 'Flexibilität steigern'}

Antworte auf Deutsch. Sei konkret und passe die Ratschläge an das Benutzerprofil an.`,
    en: `User profile:
- Name: ${profile.name}
- Age: ${profile.age} years
- Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Gender: ${profile.gender}
- Level: ${profile.fitnessLevel}
- Goal: ${profile.goal === 'loseWeight' ? 'lose weight' : profile.goal === 'gainMuscle' ? 'build muscle' : profile.goal === 'getFit' ? 'get fit' : 'improve flexibility'}

Answer in English. Be specific and tailor advice to the user's profile.`,
  };

  return contexts[language] ?? contexts.en;
}

// === Główna klasa serwisu AI ===

export interface AIServiceConfig {
  modelPath: string;
  contextSize: number;
  maxTokens: number;
  temperature: number;
  topP: number;
}

const DEFAULT_CONFIG: AIServiceConfig = {
  modelPath: '', // ustawiane po załadowaniu modelu
  contextSize: 4096, // na urządzeniu mobilnym trzymamy mniejszy kontekst
  maxTokens: 512,
  temperature: 0.7,
  topP: 0.9,
};

export type StreamCallback = (token: string) => void;
export type CompleteCallback = (fullResponse: string) => void;

class AIService {
  private config: AIServiceConfig;
  private isLoaded = false;
  private isGenerating = false;

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async loadModel(modelPath: string): Promise<boolean> {
    this.config.modelPath = modelPath;

    // TODO: Integracja z native module (llama.cpp / LiteRT-LM)
    // Na razie symulujemy załadowanie modelu
    //
    // Docelowa implementacja:
    // 1. React Native bridge do llama.cpp (C++ via JSI)
    // 2. Załadowanie modelu GGUF z local storage
    // 3. Inicjalizacja kontekstu z rozmiarem this.config.contextSize
    //
    // import { initLlama } from 'react-native-llama';
    // this.context = await initLlama({
    //   model: modelPath,
    //   n_ctx: this.config.contextSize,
    //   n_threads: 4,
    // });

    console.log(`[AIService] Model załadowany z: ${modelPath}`);
    this.isLoaded = true;
    return true;
  }

  buildSystemPrompt(personality: TrainerPersonality, profile: UserProfile, language: string): string {
    const lang = language as 'pl' | 'de' | 'en';
    const trainerPrompt = TRAINER_SYSTEM_PROMPTS[personality]?.[lang]
      ?? TRAINER_SYSTEM_PROMPTS[personality]?.en
      ?? TRAINER_SYSTEM_PROMPTS.custom.en;
    const userContext = buildUserContext(profile, lang);

    return `${trainerPrompt}\n\n${userContext}`;
  }

  async generateResponse(
    systemPrompt: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    onStream?: StreamCallback,
  ): Promise<string> {
    if (this.isGenerating) {
      throw new Error('Generowanie w toku — poczekaj na zakończenie.');
    }

    this.isGenerating = true;

    try {
      // TODO: Prawdziwy inference — na razie placeholder
      //
      // Docelowa implementacja:
      // const result = await this.context.completion({
      //   messages: [
      //     { role: 'system', content: systemPrompt },
      //     ...messages,
      //   ],
      //   n_predict: this.config.maxTokens,
      //   temperature: this.config.temperature,
      //   top_p: this.config.topP,
      //   stop: ['</s>', '<|end|>'],
      //   stream: true,
      //   onToken: (token) => onStream?.(token),
      // });
      // return result.text;

      // Placeholder — symulacja odpowiedzi
      const lastUserMessage = messages[messages.length - 1]?.content ?? '';
      const response = this.generatePlaceholderResponse(lastUserMessage);

      // Symulacja streamingu
      if (onStream) {
        const words = response.split(' ');
        for (const word of words) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          onStream(word + ' ');
        }
      }

      return response;
    } finally {
      this.isGenerating = false;
    }
  }

  private generatePlaceholderResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    if (lower.includes('plan') || lower.includes('trening') || lower.includes('workout')) {
      return '💪 Przygotowuję dla Ciebie plan treningowy! Na razie model AI jest w trybie placeholder — pełna integracja z Gemma 4 E4B jest w trakcie implementacji. Wkrótce będę mógł tworzyć spersonalizowane plany dopasowane do Twojego poziomu i celów!';
    }

    if (lower.includes('dieta') || lower.includes('jedzenie') || lower.includes('kalorie')) {
      return '🥗 Porady dietetyczne będą dostępne po pełnej integracji modelu AI. Gemma 4 E4B pozwoli mi analizować Twoje potrzeby kaloryczne i tworzyć plany żywieniowe!';
    }

    if (lower.includes('ból') || lower.includes('kontuzja') || lower.includes('lekarz')) {
      return '⚕️ Nie jestem lekarzem i nie mogę diagnozować problemów zdrowotnych. Jeśli odczuwasz ból lub dyskomfort, skonsultuj się z lekarzem przed kontynuowaniem treningu. Twoje zdrowie jest najważniejsze!';
    }

    return '🤖 Dzięki za wiadomość! Jestem Twoim trenerem AI FIT BRO. Model Gemma 4 E4B jest w trakcie integracji — wkrótce będę mógł prowadzić pełne konwersacje treningowe, tworzyć plany i motywować Cię do działania!';
  }

  getIsLoaded(): boolean {
    return this.isLoaded;
  }

  getIsGenerating(): boolean {
    return this.isGenerating;
  }

  stopGeneration(): void {
    // TODO: Implementacja zatrzymania generowania
    // this.context?.stopCompletion();
    this.isGenerating = false;
  }
}

// Singleton
export const aiService = new AIService();
