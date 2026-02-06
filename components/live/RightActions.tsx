"use client";

type Props = {
  isTranslatorOpen: boolean;
  onToggleTranslator: () => void;
};

export function RightActions({ isTranslatorOpen, onToggleTranslator }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button className="h-10 rounded-xl px-3 border border-[var(--border)] bg-[var(--card)]">
        STT...
      </button>

      <button
        onClick={onToggleTranslator}
        className={`h-10 rounded-full px-4 border border-[var(--border)] ${
          isTranslatorOpen ? "bg-[var(--primary)] text-[var(--primary-contrast)]" : "bg-[var(--card)]"
        }`}
      >
        번역기
      </button>

      <button className="h-10 rounded-xl px-3 border border-[var(--border)] bg-[var(--card)]">
        응급실 찾기
      </button>

      <button className="h-10 rounded-xl px-3 border border-[var(--border)] bg-[var(--card)]">
        구급일지
      </button>
    </div>
  );
}
