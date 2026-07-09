# LOTM × MBTI Roguelike

Version 1 prototype for a rule-driven narrative roguelike inspired by LOTM progression and hidden MBTI inference.

This is not an MBTI questionnaire and not an AI chatbot.

The player experiences ordinary life events. The engine infers personality, world affinity, long-term memory, dice outcomes, and sequence awakening from repeated behavior.

## Core Architecture

```text
Player choice
  -> Rule Engine
  -> PlayerState update
  -> Content Pool selection
  -> LLM narrative layer
  -> UI
```

The Rule Engine is the source of truth. LLM output may narrate results, but must not change numbers, dice, sequence, chapter, or ending.

## V1 Features

- Fixed chapter state machine:
  - Graduation
  - Summer
  - University
  - Sequence Growth
  - Ascension
  - Ending
- Four-choice event model.
- Public stats:
  - knowledge
  - logic
  - emotion
  - courage
  - wealth
  - health
  - charisma
- Hidden stats:
  - curiosity
  - obsession
  - sanity
  - luck
  - destiny
  - faith
  - loneliness
- Hidden personality signals:
  - introversion
  - extraversion
  - intuition
  - sensing
  - thinking
  - feeling
  - judging
  - perceiving
- Hidden world affinity:
  - science
  - mystery
  - fate
- 22 LOTM sequence profiles with weighted MBTI axis scoring.
- Automatic sequence awakening. The player cannot directly select a sequence.
- D20 dice checks for milestones.
- NPC, item, event, tag, and dice memory.
- Destiny events that are forced by the engine.
- Supabase save hook for full run state and log.

## Important Files

- `lib/game/types.ts`
  - V1 type model for chapters, player state, events, choices, dice, memory, and sequences.
- `lib/game/content.ts`
  - V1 content pool and 22 sequence profiles.
- `lib/game/engine.ts`
  - Rule engine for event selection, effects, dice, chapter progression, sequence awakening, and ascension.
- `components/game-shell.tsx`
  - Playable Next.js UI.
- `supabase/schema.sql`
  - Prototype save table.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add Supabase values when persistence is needed.

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```

## Design Priority

When changing gameplay, follow this order:

1. `RULE_ENGINE.md`
2. `LOTM_MBTI_SEQUENCE_MAPPING.md`
3. `EVENT_TAG_RULE.md`
4. `GAME_CONTENT_SPEC_V2.md`
5. `LORE.md`

Then update code.
