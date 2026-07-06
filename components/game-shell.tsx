"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CONTENT_POOL } from "@/lib/game/content";
import { createInitialState, inferMbti, leadingPath, resolveTurn, selectEvent } from "@/lib/game/engine";
import type { GameEvent, GameLogEntry, PlayerState, Stage } from "@/lib/game/types";

const STAGE_LABELS: Record<Stage, string> = {
  ACADEMIC: "学术偏置",
  PERSONALITY: "人格显影",
  PATH: "路径成形",
  LIFE: "人生循环",
  ASCENSION: "飞升结算"
};

export function GameShell() {
  const initialState = useMemo(() => createInitialState(), []);
  const [state, setState] = useState<PlayerState>(initialState);
  const [event, setEvent] = useState<GameEvent>(() => selectEvent(initialState));
  const [log, setLog] = useState<GameLogEntry[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const mbti = useMemo(() => inferMbti(state), [state]);
  const path = useMemo(() => leadingPath(state), [state]);

  function choose(choice: "A" | "B") {
    console.log("CLICK:", choice);
    const result = resolveTurn(state, event, choice);
    setState(result.state);
    setLog((current) => [result.logEntry, ...current].slice(0, 8));
    setEvent(selectEvent(result.state));
    setSaveState("idle");
  }

  function restart() {
    const next = createInitialState();
    setState(next);
    setEvent(selectEvent(next));
    setLog([]);
    setSaveState("idle");
  }

  async function saveRun() {
    const supabase = createClient();
    if (!supabase) {
      setSaveState("error");
      return;
    }

    setSaveState("saving");
    const { error } = await supabase.from("game_runs").insert({
      player_state: state,
      event_log: log
    });
    setSaveState(error ? "error" : "saved");
  }

  return (
    <main className="min-h-[100dvh] px-4 py-5 text-[var(--ink)] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <section className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] shadow-[0_24px_80px_rgb(36_53_46/0.16)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)] pulse-line" />
          <div className="grid gap-6 p-5 md:p-8">
            <header className="grid gap-5 border-b border-[var(--line)] pb-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs text-[var(--accent-dark)]">CONTENT POOL ENGINE</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal md:text-6xl">
                  规则不讲故事，规则只决定后果。
                </h1>
              </div>
              <div className="grid min-w-48 content-end gap-2 font-mono text-sm text-[var(--muted)]">
                <span>Turn {state.turn.toString().padStart(2, "0")}</span>
                <span>MBTI {mbti}</span>
                <span>{path}</span>
              </div>
            </header>

            <StageRail activeStage={state.stage} />

            <article className="grid gap-5 rounded-lg border border-[var(--line)] bg-[var(--panel-strong)] p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--ink)] px-3 py-1 font-mono text-xs text-white">
                  {STAGE_LABELS[event.stage]}
                </span>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--muted)]">
                  {event.type}
                </span>
                {event.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#e8ece1] px-3 py-1 font-mono text-xs text-[var(--signal)]">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="max-w-3xl text-2xl font-medium leading-snug md:text-3xl">{event.text}</p>

              {state.ascensionResult ? (
                <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-[#eef2ea] p-4">
                  <p className="font-mono text-sm text-[var(--accent-dark)]">
                    {state.ascensionResult === "success" ? "ASCENSION COMPLETE" : "COLLAPSE RECORDED"}
                  </p>
                  <button
                    type="button"
                    onClick={restart}
                    className="w-fit rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition active:translate-y-px"
                  >
                    重新开局
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  <ChoiceButton label="A" text={event.choices?.A.text ?? "继续"} onClick={() => choose("A")} />
                  <ChoiceButton label="B" text={event.choices?.B.text ?? "等待"} onClick={() => choose("B")} />
                </div>
              )}
            </article>

            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--muted)]">
                引擎只处理阶段、权重、骰检和状态。叙事文本来自内容池，LLM 只能渲染，不能改判定。
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveRun}
                  disabled={saveState === "saving"}
                  className="rounded-lg border border-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-[#f5dde0] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveState === "saving" ? "保存中" : "保存到 Supabase"}
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-semibold transition hover:bg-white active:translate-y-px"
                >
                  重置
                </button>
              </div>
            </div>

            {saveState === "error" ? (
              <p className="rounded-lg border border-[var(--warning)] bg-[#fff8e8] px-4 py-3 text-sm text-[#73410f]">
                未配置 Supabase 环境变量，或保存失败。先复制 `.env.example` 到 `.env.local` 并填入项目配置。
              </p>
            ) : null}
            {saveState === "saved" ? (
              <p className="rounded-lg border border-[#8aa28c] bg-[#eff8ef] px-4 py-3 text-sm text-[#2f6038]">
                本局已写入 `game_runs`。
              </p>
            ) : null}
          </div>
        </section>

        <aside className="grid gap-5 lg:sticky lg:top-5 lg:self-start">
          <StatePanel state={state} />
          <PoolPanel activeEvent={event} />
          <LogPanel log={log} />
        </aside>
      </div>
    </main>
  );
}

function StageRail({ activeStage }: { activeStage: Stage }) {
  const stages = Object.keys(STAGE_LABELS) as Stage[];
  const activeIndex = stages.indexOf(activeStage);

  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {stages.map((stage, index) => (
        <div
          key={stage}
          className={`rounded-lg border px-3 py-3 ${
            index <= activeIndex
              ? "border-[var(--accent)] bg-[#f5dde0] text-[var(--accent-dark)]"
              : "border-[var(--line)] bg-[#edf1e7] text-[var(--muted)]"
          }`}
        >
          <p className="font-mono text-[11px]">{`S${index}`}</p>
          <p className="mt-1 text-sm font-semibold">{STAGE_LABELS[stage]}</p>
        </div>
      ))}
    </div>
  );
}

function ChoiceButton({ label, text, onClick }: { label: string; text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid min-h-28 grid-cols-[auto_1fr] items-start gap-4 rounded-lg border border-[var(--line)] bg-[#eef2ea] p-4 text-left transition hover:border-[var(--accent)] hover:bg-[#f8e7e9] active:translate-y-px"
    >
      <span className="grid size-10 place-items-center rounded-lg bg-[var(--ink)] font-mono text-sm font-semibold text-white group-hover:bg-[var(--accent)]">
        {label}
      </span>
      <span className="text-lg font-semibold leading-snug">{text}</span>
    </button>
  );
}

function StatePanel({ state }: { state: PlayerState }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="text-lg font-semibold">状态仪表</h2>
      <MeterGroup title="Visible stats" values={state.stats} />
      <MeterGroup title="Hidden pressure" values={state.hidden} danger />
    </section>
  );
}

function MeterGroup({ title, values, danger = false }: { title: string; values: Record<string, number>; danger?: boolean }) {
  const max = Math.max(6, ...Object.values(values));

  return (
    <div className="mt-5 grid gap-3">
      <p className="font-mono text-xs text-[var(--muted)]">{title}</p>
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="grid gap-1">
          <div className="flex items-center justify-between font-mono text-xs">
            <span>{key}</span>
            <span>{value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#dce3d6]">
            <div
              className={`h-full rounded-full ${danger ? "bg-[var(--accent)]" : "bg-[var(--signal)]"}`}
              style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PoolPanel({ activeEvent }: { activeEvent: GameEvent }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="text-lg font-semibold">内容池</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile label="Total events" value={CONTENT_POOL.length} />
        <StatTile label="Active event" value={activeEvent.id} />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        权重 = base + pathBonus + tagMatch - repetitionPenalty。关键事件只在 trigger 满足后进入选择。
      </p>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[#eef2ea] p-3">
      <p className="font-mono text-[11px] text-[var(--muted)]">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold">{value}</p>
    </div>
  );
}

function LogPanel({ log }: { log: GameLogEntry[] }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="text-lg font-semibold">运行日志</h2>
      <div className="mt-4 grid gap-3">
        {log.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
            做出第一个选择后，这里会记录阶段、选项和骰检结果。
          </p>
        ) : (
          log.map((entry) => (
            <div key={`${entry.turn}-${entry.eventId}`} className="rounded-lg border border-[var(--line)] bg-[#eef2ea] p-3">
              <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-[var(--muted)]">
                <span>TURN {entry.turn}</span>
                <span>{entry.stage}</span>
              </div>
              <p className="mt-2 text-sm leading-6">{entry.text}</p>
              {entry.dice ? (
                <p className="mt-2 font-mono text-xs text-[var(--accent-dark)]">
                  d20 {entry.dice.roll} + {entry.dice.stat} = {entry.dice.total} / DC {entry.dice.dc}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
