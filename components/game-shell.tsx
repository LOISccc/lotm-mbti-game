"use client";

import { useMemo, useRef, useState } from "react";
import { DiceCheck } from "@/components/dice-check";
import { createClient } from "@/lib/supabase/client";
import { CONTENT_POOL } from "@/lib/game/content";
import {
  createInitialState,
  getCurrentSequenceName,
  getMbtiReveal,
  resolveTurn,
  selectEvent
} from "@/lib/game/engine";
import type { Chapter, ChoiceKey, EngineResult, GameEvent, GameLogEntry, PlayerState } from "@/lib/game/types";

const CHAPTER_LABELS: Record<Chapter, string> = {
  GRADUATION: "第一章 高考结束",
  SUMMER: "第二章 暑假",
  UNIVERSITY: "第三章 大学",
  SEQUENCE: "第四章 序列成长",
  ASCENSION: "第五章 飞升",
  ENDING: "结局"
};

const OUTCOME_LABELS = {
  critical_failure: "大失败",
  failure: "失败",
  success: "成功",
  critical_success: "大成功"
};

export function GameShell() {
  const resolvingRef = useRef(false);
  const initialState = useMemo(() => createInitialState(), []);
  const [state, setState] = useState<PlayerState>(initialState);
  const [event, setEvent] = useState<GameEvent>(() => selectEvent(initialState));
  const [log, setLog] = useState<GameLogEntry[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [pendingResult, setPendingResult] = useState<EngineResult | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const mbtiReveal = useMemo(() => getMbtiReveal(state), [state]);
  const sequenceName = useMemo(() => getCurrentSequenceName(state), [state]);

  function choose(choice: ChoiceKey) {
    if (state.chapter === "ENDING" || resolvingRef.current) {
      return;
    }

    resolvingRef.current = true;
    setIsResolving(true);
    const result = resolveTurn(state, event, choice);
    setState(result.state);
    setLog((current) => [result.logEntry, ...current].slice(0, 10));
    setSaveState("idle");

    if (result.logEntry.dice) {
      setPendingResult(result);
      return;
    }

    setEvent(result.event);
    resolvingRef.current = false;
    setIsResolving(false);
  }

  function continueAfterDice() {
    if (!pendingResult) {
      resolvingRef.current = false;
      setIsResolving(false);
      return;
    }

    setEvent(pendingResult.event);
    setPendingResult(null);
    resolvingRef.current = false;
    setIsResolving(false);
  }

  function restart() {
    const next = createInitialState();
    resolvingRef.current = false;
    setState(next);
    setEvent(selectEvent(next));
    setLog([]);
    setPendingResult(null);
    setIsResolving(false);
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
      <div className="mx-auto grid max-w-[1480px] gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <section className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] shadow-[0_24px_80px_rgb(36_53_46/0.16)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)] pulse-line" />
          <div className="grid gap-6 p-5 md:p-8">
            <header className="grid gap-5 border-b border-[var(--line)] pb-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs text-[var(--accent-dark)]">诡秘 × 人格成长 Roguelike V1.0.1</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal md:text-6xl">
                  我不是在选择序列，我正在成为序列。
                </h1>
              </div>
              <div className="grid min-w-56 content-end gap-2 font-mono text-sm text-[var(--muted)]">
                <span>回合 {state.turn.toString().padStart(2, "0")}</span>
                <span>{CHAPTER_LABELS[state.chapter]}</span>
                <span>人格遮罩：{mbtiReveal}</span>
                <span>{sequenceName}</span>
              </div>
            </header>

            <ChapterRail activeChapter={state.chapter} />

            {pendingResult?.logEntry.dice ? (
              <DiceCheck
                key={`${pendingResult.logEntry.eventId}-${pendingResult.logEntry.turn}`}
                dice={pendingResult.logEntry.dice}
                onContinue={continueAfterDice}
              />
            ) : (
            <article className="grid gap-5 rounded-lg border border-[var(--line)] bg-[var(--panel-strong)] p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--ink)] px-3 py-1 font-mono text-xs text-white">
                  {CHAPTER_LABELS[event.chapter]}
                </span>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--muted)]">
                  {event.rarity}
                </span>
                <span className="rounded-full bg-[#e8ece1] px-3 py-1 font-mono text-xs text-[var(--signal)]">
                  异常等级 {event.strangeLevel}
                </span>
              </div>

              <div>
                <p className="font-mono text-xs text-[var(--muted)]">{event.scene}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{event.title}</h2>
              </div>

              <p className="max-w-4xl text-xl leading-9 text-[#26302b]">{event.narrative}</p>

              {state.chapter === "ENDING" ? (
                <EndingPanel state={state} onRestart={restart} />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(event.choices).map(([key, choice]) => (
                    <ChoiceButton
                      key={key}
                      label={key}
                      text={choice.text}
                      tone={choice.tone}
                      disabled={isResolving}
                      onClick={() => choose(key as ChoiceKey)}
                    />
                  ))}
                </div>
              )}
            </article>
            )}

            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--muted)]">
                规则引擎先于叙事执行。语言模型只能表达结果，不能改写属性、骰检、序列或结局。
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveRun}
                  disabled={saveState === "saving" || isResolving}
                  className="rounded-lg border border-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-[#f5dde0] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveState === "saving" ? "保存中" : "保存到 Supabase"}
                </button>
                <button
                  type="button"
                  onClick={restart}
                  disabled={isResolving}
                  className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-semibold transition hover:bg-white active:translate-y-px"
                >
                  重新开始
                </button>
              </div>
            </div>

            {saveState === "error" ? (
              <p className="rounded-lg border border-[var(--warning)] bg-[#fff8e8] px-4 py-3 text-sm text-[#73410f]">
                Supabase 尚未配置或保存失败。请检查 `.env.local` 和 `game_runs` 表。
              </p>
            ) : null}
            {saveState === "saved" ? (
              <p className="rounded-lg border border-[#8aa28c] bg-[#eff8ef] px-4 py-3 text-sm text-[#2f6038]">
                本局已写入 `game_runs`。
              </p>
            ) : null}
          </div>
        </section>

        <aside className="grid gap-5 xl:sticky xl:top-5 xl:self-start">
          <StatePanel state={state} />
          <MemoryPanel state={state} />
          <PoolPanel activeEvent={event} />
          <LogPanel log={log} />
        </aside>
      </div>
    </main>
  );
}

function ChapterRail({ activeChapter }: { activeChapter: Chapter }) {
  const chapters = Object.keys(CHAPTER_LABELS) as Chapter[];
  const activeIndex = chapters.indexOf(activeChapter);

  return (
    <div className="grid gap-2 md:grid-cols-6">
      {chapters.map((chapter, index) => (
        <div
          key={chapter}
          className={`rounded-lg border px-3 py-3 ${
            index <= activeIndex
              ? "border-[var(--accent)] bg-[#f5dde0] text-[var(--accent-dark)]"
              : "border-[var(--line)] bg-[#edf1e7] text-[var(--muted)]"
          }`}
        >
          <p className="font-mono text-[11px]">{`CH${index + 1}`}</p>
          <p className="mt-1 text-sm font-semibold leading-snug">{CHAPTER_LABELS[chapter]}</p>
        </div>
      ))}
    </div>
  );
}

function ChoiceButton({
  label,
  text,
  tone,
  onClick,
  disabled
}: {
  label: string;
  text: string;
  tone: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group grid min-h-32 grid-cols-[auto_1fr] items-start gap-4 rounded-lg border border-[var(--line)] bg-[#eef2ea] p-4 text-left transition hover:border-[var(--accent)] hover:bg-[#f8e7e9] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span className="grid size-10 place-items-center rounded-lg bg-[var(--ink)] font-mono text-sm font-semibold text-white group-hover:bg-[var(--accent)]">
        {label}
      </span>
      <span className="grid gap-2">
        <span className="text-lg font-semibold leading-snug">{text}</span>
        <span className="font-mono text-xs text-[var(--muted)]">{tone}</span>
      </span>
    </button>
  );
}

function StatePanel({ state }: { state: PlayerState }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="text-lg font-semibold">状态仪表</h2>
      <MeterGroup title="公开属性" values={state.stats} />
      <MeterGroup title="世界倾向" values={state.worldAffinity} accent />
      <div className="mt-5 rounded-lg border border-dashed border-[var(--line)] p-3">
        <p className="font-mono text-xs text-[var(--muted)]">隐藏属性仅参与判定</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          curiosity / obsession / sanity / luck / destiny / faith / loneliness 不直接暴露给玩家。
        </p>
      </div>
    </section>
  );
}

function MeterGroup({ title, values, accent = false }: { title: string; values: Record<string, number>; accent?: boolean }) {
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
              className={`h-full rounded-full ${accent ? "bg-[var(--accent)]" : "bg-[var(--signal)]"}`}
              style={{ width: `${Math.min(100, (Math.max(0, value) / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MemoryPanel({ state }: { state: PlayerState }) {
  const npcCount = Object.keys(state.npcMemory).length;
  const itemCount = Object.keys(state.inventory).length;

  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="text-lg font-semibold">长期记忆</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatTile label="人物" value={npcCount} />
        <StatTile label="道具" value={itemCount} />
        <StatTile label="标记" value={state.tags.length} />
      </div>
      <div className="mt-4 grid gap-2">
        {state.eventMemory.slice(0, 3).map((memory) => (
          <p key={`${memory.eventId}-${memory.choice}`} className="rounded-lg border border-[var(--line)] bg-[#eef2ea] p-3 text-sm leading-6">
            {memory.summary}
          </p>
        ))}
        {state.eventMemory.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--line)] p-3 text-sm text-[var(--muted)]">
            世界还没有留下足够记忆。
          </p>
        ) : null}
      </div>
    </section>
  );
}

function PoolPanel({ activeEvent }: { activeEvent: GameEvent }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="text-lg font-semibold">内容池</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile label="事件数" value={CONTENT_POOL.length} />
        <StatTile label="当前" value={activeEvent.title} />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        候选池由章节、Tag、Trigger、世界倾向、人格倾向、重复惩罚共同决定。命运事件由 Engine 强制触发。
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
            做出选择后，这里会记录章节、骰检、序列候选和长期反馈。
          </p>
        ) : (
          log.map((entry) => (
            <div key={`${entry.turn}-${entry.eventId}`} className="rounded-lg border border-[var(--line)] bg-[#eef2ea] p-3">
              <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-[var(--muted)]">
                <span>回合 {entry.turn}</span>
                <span>{CHAPTER_LABELS[entry.chapter]}</span>
              </div>
              <p className="mt-2 text-sm font-semibold">{entry.title}</p>
              <p className="mt-1 text-sm leading-6">{entry.summary}</p>
              {entry.dice ? (
                <p className="mt-2 font-mono text-xs text-[var(--accent-dark)]">
                  D20 {entry.dice.roll} + {entry.dice.modifier} = {entry.dice.finalValue} / DC {entry.dice.dc} ·{" "}
                  {OUTCOME_LABELS[entry.dice.outcome]}
                </p>
              ) : null}
              {entry.awakenedSequence ? (
                <p className="mt-2 rounded-lg bg-[#f5dde0] px-3 py-2 text-sm text-[var(--accent-dark)]">
                  序列开启：{entry.awakenedSequence.name}
                </p>
              ) : null}
              {entry.sequenceCandidates ? (
                <div className="mt-2 grid gap-1 font-mono text-xs text-[var(--muted)]">
                  {entry.sequenceCandidates.map((candidate) => (
                    <span key={candidate.id}>
                      {candidate.name} {candidate.score}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function EndingPanel({ state, onRestart }: { state: PlayerState; onRestart: () => void }) {
  const label =
    state.ascensionResult === "hidden_ending"
      ? "隐藏结局"
      : state.ascensionResult === "ascended"
        ? "飞升成功"
        : "飞升失败";

  return (
    <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-[#eef2ea] p-4">
      <p className="font-mono text-sm text-[var(--accent-dark)]">{label}</p>
      <p className="text-sm leading-6 text-[var(--muted)]">
        结局由人格、世界倾向、序列进度、隐藏属性、长期记忆和关键骰检共同决定。
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="w-fit rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition active:translate-y-px"
      >
        重新经历人生
      </button>
    </div>
  );
}
