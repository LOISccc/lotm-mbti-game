# Content Pool Roguelike

Next.js + TypeScript + Tailwind + Supabase prototype based on the two specs:

- `content-pool-engine-spec.md`
- `game-design.md`

The app implements a deterministic content-pool engine for a narrative roguelike:

- Stage 0 academic stat bias
- Stage 1 MBTI signal accumulation
- Stage 2 path affinity formation as a short bridge
- Stage 3 life roguelike loop with atomic/template/key events
- Stage 4 ascension or collapse resolution
- Tag/path weighted event selection
- Repetition penalty
- 1d20 dice checks for key events

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add Supabase values when persistence is needed.
