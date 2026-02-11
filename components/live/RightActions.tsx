"use client";
/* 우하단 행동버튼 */
import "@/styles/components.css";

type Props = {
  isTranslatorOpen: boolean;
  onToggleTranslator: () => void;
  onOpenHospital: () => void;
  onOpenReport: () => void;
};

export function RightActions({ isTranslatorOpen, onToggleTranslator, onOpenHospital, onOpenReport }: Props) {
  return (
    <div className="flex items-center gap-2">
    </div>
  );
}
