"use client";

import { useEffect, useState } from "react";
import type { DiceResult } from "@/lib/game/types";

const OUTCOME_LABELS = {
  critical_failure: "大失败",
  failure: "失败",
  success: "成功",
  critical_success: "大成功"
};

const STEP_LABELS = ["掷骰", "结果", "世界回应", "继续"] as const;

export function DiceCheck({ dice, onContinue }: { dice: DiceResult; onContinue: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 520),
      window.setTimeout(() => setStep(2), 1100),
      window.setTimeout(() => setStep(3), 1700)
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [dice.eventId, dice.roll, dice.finalValue]);

  return (
    <section className="grid gap-5 rounded-lg border border-[var(--accent)] bg-[#fff8f0] p-5 md:p-7">
      <div className="flex flex-wrap gap-2">
        {STEP_LABELS.map((label, index) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 font-mono text-xs ${
              index <= step ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div>
        <p className="font-mono text-xs text-[var(--muted)]">可见 D20 检定</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{dice.reason}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div className="grid aspect-square place-items-center rounded-lg border border-[var(--line)] bg-white">
          <div className="text-center">
            <p className="font-mono text-xs text-[var(--muted)]">{step === 0 ? "掷骰中" : "D20"}</p>
            <p className="mt-2 text-6xl font-semibold text-[var(--accent-dark)]">{step === 0 ? "..." : dice.roll}</p>
          </div>
        </div>

        <div className="grid content-center gap-3">
          {step >= 1 ? (
            <p className="text-xl font-semibold">
              {dice.roll} + {dice.modifier} = {dice.finalValue} / DC {dice.dc}，{OUTCOME_LABELS[dice.outcome]}
            </p>
          ) : (
            <p className="text-xl font-semibold text-[var(--muted)]">骰子正在落下。</p>
          )}
          {step >= 2 ? <p className="text-base leading-7 text-[#26302b]">{dice.worldResponse}</p> : null}
          {step >= 3 ? <p className="text-sm leading-6 text-[var(--muted)]">{dice.rewardText}</p> : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={step < 3}
        className="w-fit rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
      >
        继续
      </button>
    </section>
  );
}
