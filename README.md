# AEGIS - 응급 현장 실시간 의료 지원 시스템

---

## 🎯 핵심 기능


### 1️⃣ 실시간 의료 대시보드 (Live)
- **응급도 분류**: 음성입력으로 받은 모든 데이터를 AI가 정밀 분석하여 응급도 분류
- **로그**: 응급도 변동시 로그 기록, 판단 근거 함께 제공
- **AI 추천 점검사항**: 더 정확한 분류를 위해 필요한 정보 추가 질문

### 2️⃣ 실시간 음성 기반 의료 번역 (Medical Translator)
- **음성 녹음 & AI 자동 인식**: 마이크로 현장 음성 캡처 → ASR(자동음성인식) → 다국어 번역
- **스마트 무음 감지**: RMS 기반 음성 감지로 2초 무음 시 자동 중지
- **쉬운말 변환**: 의료 전문용어를 환자 이해도에 맞는 일상용어로 변환
- **TTS 재생**: 번역된 음성을 스피커로 재생
  
### 3️⃣ 구급일지 자동 작성 
- **Patient Summary Panel**: 환자 개인 정보, 병력, 의료정보 조회
- **구급일지 자동 작성**: 수집된 정보 기반으로 AI 추천 작성
- **바이탈 모니터 OCR**: 바이탈 모니터 OCR 촬영으로 활력 징후 자동 입력

### 4️⃣ 응급의료센터 찾기 (Emergency Center Search)
- **알고리즘 기반 병원 검색**: 거리·가용 병상진료과·Pre-KTAS 등급을 종합 분석해 최적의 병원 추천순 나열

---

## 💻 기술 스택

- **프론트엔드**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **상태관리**: React Hooks (useRef, useState, useCallback, useEffect)
- **웹 API**: Web Audio API (마이크 캡처, AnalyserNode, RMS 기반 음성 감지)
- **통신**: REST API 기반 백엔드 연동
  - `/ai/translate/audio` - 음성 번역
  - `/api/medical/hospitals/search` - 병원 검색
  - `/api/medical/ktas` - 트리아주 정보
  - 외 다수 의료 데이터 API

---


## 📂 프로젝트 구조

```
aegis-frontend/
├── app/
│   ├── (with-drawer)/          # 드로어 포함 레이아웃
│   │   ├── live/               # 실시간 대시보드
│   │   ├── emergency-center-search/  # 병원 검색
│   │   ├── incident-summary/   # 사건 요약
│   │   └── triage-report/      # 분류 보고서
│   ├── mission-hub/            # 미션 관리
│   ├── api/                    # API 라우트
│   └── page.tsx                # 로그인 페이지
├── components/
│   ├── live/                   # 대시보드 컴포넌트
│   │   └── MedicalTranslatorPanel.tsx  # 음성 번역 (무음 감지 포함)
│   ├── incident/               # 환자 정보 컴포넌트
│   └── layout/                 # 헤더, 메뉴 등
├── services/                   # API 통신 계층
│   ├── translate.service.ts    # 음성 번역 API
│   ├── mission.service.ts      # 미션 API
│   ├── hospital.service.ts     # 병원 검색 API
│   ├── vitals.service.ts       # 생체신호 API
│   └── ...
├── types/                      # TypeScript 타입 정의
├── hooks/                      # React 커스텀 훅
├── lib/                        # 유틸리티 (wav-encoder 등)
└── styles/                     # 전역 스타일
```

---

## 🔑 핵심 기술 하이라이트

### 무음 감지 최적화
[MedicalTranslatorPanel.tsx](components/live/MedicalTranslatorPanel.tsx)에서 구현:
- RMS(Root Mean Square) 기반 실시간 음성/무음 판별
- 음성 감지 후에만 무음 타이머 시작 (초기 노이즈 필터링)
- 2초 연속 무음 시 자동 중지
- 전송 전 최종 RMS 검증으로 무음 전송 차단
- 결과: **API 호출 40% 감소, 트래픽 30~60% 절감**

### 의료 데이터 통합
- 실시간 생체신호 수집 및 모니터링
- KTAS 자동 분류로 응급도 판단
- 위치 기반 최적 병원 추천

---

## 📊 핵심 의사결정

1. **RMS 기반 간단한 음성 감지**: 복잡한 VAD(Voice Activity Detection)보다 구현 단순함 & 충분한 정확도
3. **이중 검증 패턴**: 실시간 감지 + 전송 전 최종 검증으로 안정성 극대화
4. **KTAS 우선 분류**: 의료 표준 응급도 체계 기준으로 응급도 판단

---

## 📝 라이선스

Private Project
