// hooks/useAiChecklist.ts
"use client";

import { useEffect, useState } from "react";
import { reportService } from "@/services/report.service";

/**
 * 68-item 체크리스트 배열의 인덱스 ↔ 증상/병력 이름 매핑
 *
 * [0-2]   환자 발생 유형: 질병, 질병 외 (외상), 기타
 * [3-8]   통증: 두통, 흉통, 복통, 요통, 분만진통, 그 밖의 통증
 * [9-17]  외상: 골절, 탈구, 염좌, 열상, 찰과상, 타박상, 절단, 암궤손상, 화상
 * [18-23] 출혈: 객혈, 토혈, 혈변, 비출혈, 질출혈, 그 밖의 출혈
 * [24-27] 호흡 및 무의식: 호흡곤란, 호흡정지, 심정지, 경련/발작
 * [28-41] 기타 증상: 실신, 오심, 구토, 설사, 변비, 배뇨장애, 고열, 저체온증, 어지러움, 마비, 전신쇠약, 정신장애, 그 밖의 이물질, 기타
 * [42-44] 병력 여부: 있음, 없음, 미상
 * [45-56] 병력 상세: 고혈압, 당뇨, 뇌혈관질환, 폐질환, 심장질환, 결핵, 간염, 간경화, 알레르기, 암, 신부전, 기타
 * [57-58] 감염병: 해당없음, 감염병(의심)
 * [59-61] 측정 상태: 측정, 거부, 거절
 * [62-65] AVPU: A, V, P, U
 * [66-67] 발열: 예, 아니오
 */

/** 환자 증상 이름 → 체크리스트 인덱스 (증상 섹션 전용) */
export const SYMPTOM_INDEX: Record<string, number> = {
  // 통증 (3-8)
  "두통": 3, "흉통": 4, "복통": 5, "요통": 6, "분만진통": 7, "그 밖의 통증": 8,
  // 외상 (9-17)
  "골절": 9, "탈구": 10, "염좌": 11, "열상": 12, "찰과상": 13, "타박상": 14, "절단": 15, "암궤손상": 16, "화상": 17,
  // 출혈 (18-23)
  "객혈": 18, "토혈": 19, "혈변": 20, "비출혈": 21, "질출혈": 22, "그 밖의 출혈": 23,
  // 호흡 및 무의식 (24-27)
  "호흡곤란": 24, "호흡정지": 25, "심정지": 26, "경련/발작": 27,
  // 기타 증상 (28-41)
  "실신": 28, "오심": 29, "구토": 30, "설사": 31, "변비": 32, "배뇨장애": 33,
  "고열": 34, "저체온증": 35, "어지러움": 36, "마비": 37, "전신쇠약": 38,
  "정신장애": 39, "그 밖의 이물질": 40, "기타_증상": 41,
};

/** 병력 상세 이름 → 체크리스트 인덱스 (병력 섹션 전용) */
export const HISTORY_INDEX: Record<string, number> = {
  "고혈압": 45, "당뇨": 46, "뇌혈관질환": 47, "폐질환": 48, "심장질환": 49,
  "결핵": 50, "간염": 51, "간경화": 52, "알레르기": 53, "암": 54, "신부전": 55, "기타_병력": 56,
};

/** 감염병 여부 이름 → 체크리스트 인덱스 */
export const INFECTION_INDEX: Record<string, number> = {
  "해당없음": 57, "감염병(의심)": 58,
};

/** 발생 유형 → 인덱스 */
const INCIDENT_INDEX: Record<string, number> = {
  "질병": 0, "질병 외 (외상)": 1, "기타": 2,
};

/** 병력 여부 → 인덱스 */
const HISTORY_PRESENCE_INDEX: Record<string, number> = {
  "있음": 42, "없음": 43, "미상": 44,
};

/**
 * UI 선택 상태 → 68-item binary 배열 변환
 */
export function buildChecklistArray(opts: {
  incidentType: string;
  symptoms: Set<string>;
  historyPresence: string;
  historyDetails: Set<string>;
  simpleHistoryFlags: Set<string>;
}): number[] {
  const arr = new Array(68).fill(0);

  // 발생 유형
  const itIdx = INCIDENT_INDEX[opts.incidentType];
  if (itIdx !== undefined) arr[itIdx] = 1;

  // 증상
  for (const name of opts.symptoms) {
    // UI "기타" → 매핑 키 "기타_증상"
    const key = name === "기타" ? "기타_증상" : name;
    const idx = SYMPTOM_INDEX[key];
    if (idx !== undefined) arr[idx] = 1;
  }

  // 병력 여부
  const hpIdx = HISTORY_PRESENCE_INDEX[opts.historyPresence];
  if (hpIdx !== undefined) arr[hpIdx] = 1;

  // 병력 상세
  for (const name of opts.historyDetails) {
    const key = name === "기타" ? "기타_병력" : name;
    const idx = HISTORY_INDEX[key];
    if (idx !== undefined) arr[idx] = 1;
  }

  // 감염병 여부
  for (const name of opts.simpleHistoryFlags) {
    const idx = INFECTION_INDEX[name];
    if (idx !== undefined) arr[idx] = 1;
  }

  return arr;
}

/**
 * 68-item binary 배열 → UI 표시용 문자열 배열로 역변환
 */
export function parseChecklistArray(arr: number[]): {
  incidentType: string;
  symptoms: string[];
  historyPresence: string;
  historyDetails: string[];
  infections: string[];
} {
  const incidentType =
    Object.entries(INCIDENT_INDEX).find(([, idx]) => arr[idx] === 1)?.[0] ?? "";
  const historyPresence =
    Object.entries(HISTORY_PRESENCE_INDEX).find(([, idx]) => arr[idx] === 1)?.[0] ?? "";

  const symptoms: string[] = [];
  for (const [name, idx] of Object.entries(SYMPTOM_INDEX)) {
    if (arr[idx] === 1) symptoms.push(name === "기타_증상" ? "기타" : name);
  }

  const historyDetails: string[] = [];
  for (const [name, idx] of Object.entries(HISTORY_INDEX)) {
    if (arr[idx] === 1) historyDetails.push(name === "기타_병력" ? "기타" : name);
  }

  const infections: string[] = [];
  for (const [name, idx] of Object.entries(INFECTION_INDEX)) {
    if (arr[idx] === 1) infections.push(name);
  }

  return { incidentType, symptoms, historyPresence, historyDetails, infections };
}

/**
 * AI 체크리스트 데이터를 가져와 Set<string>으로 변환
 */
export function useAiChecklist() {
  // TODO: 목업 제거 후 빈 Set으로 복원
  const [aiSymptoms, setAiSymptoms] = useState<Set<string>>(new Set(["두통"]));
  const [aiHistory, setAiHistory] = useState<Set<string>>(new Set());
  const [aiInfection, setAiInfection] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("aegis_active_sessionId");
    const sessionId = raw ? Number(raw) : null;
    if (!sessionId) return;

    let cancelled = false;

    reportService.get(sessionId).then((report) => {
      if (cancelled) return;
      const arr = report.aiChecklistData;
      if (!arr || arr.length < 68) {
        setLoaded(true);
        return;
      }

      // 증상 매핑
      const symptoms = new Set<string>();
      for (const [name, idx] of Object.entries(SYMPTOM_INDEX)) {
        if (arr[idx] === 1) {
          // "기타_증상" → UI에서는 "기타"
          symptoms.add(name === "기타_증상" ? "기타" : name);
        }
      }
      setAiSymptoms(symptoms);

      // 병력 매핑
      const history = new Set<string>();
      for (const [name, idx] of Object.entries(HISTORY_INDEX)) {
        if (arr[idx] === 1) {
          history.add(name === "기타_병력" ? "기타" : name);
        }
      }
      setAiHistory(history);

      // 감염병 매핑
      const infection = new Set<string>();
      for (const [name, idx] of Object.entries(INFECTION_INDEX)) {
        if (arr[idx] === 1) infection.add(name);
      }
      setAiInfection(infection);

      setLoaded(true);
    }).catch(() => {
      if (!cancelled) setLoaded(true);
    });

    return () => { cancelled = true; };
  }, []);

  return { aiSymptoms, aiHistory, aiInfection, loaded };
}
