"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface TmapMapProps {
  heightPx?: number;
  /** true면 부모 높이를 100% 채움 (heightPx 무시) */
  fill?: boolean;
  /** 외부에서 전달한 좌표 → 지도 중심 이동 + 마커 표시 */
  center?: { lat: number; lng: number };
  /** 값이 바뀌면 좌표가 같아도 강제로 지도 재센터링 */
  centerKey?: number;
  /** 내 GPS 위치 → 빨간 점멸 점으로 표시 */
  myLocation?: { lat: number; lng: number };
  /** 현재위치 버튼 클릭 콜백 (전달하면 버튼이 보임) */
  onGoToMyLocation?: () => void;
}

/* ------------------------------------------------------------------ */
/*  최소 Tmapv3 타입 (any 금지 → 명시적 인터페이스)                      */
/* ------------------------------------------------------------------ */
type TmapLatLng = Record<string, unknown>;

type TmapMapInst = {
  setCenter: (latlng: TmapLatLng) => void;
};

type TmapMarkerInst = {
  setMap: (map: TmapMapInst | null) => void;
};

type Tmapv3Like = {
  Map: new (
    el: HTMLElement,
    options: { center: TmapLatLng; width: string; height: string; zoom: number },
  ) => TmapMapInst;
  LatLng: new (lat: number, lng: number) => TmapLatLng;
  Marker: new (options: {
    position: TmapLatLng;
    map: TmapMapInst;
    iconHTML?: string;
    icon?: string;
  }) => TmapMarkerInst;
};

/* ------------------------------------------------------------------ */
/*  SDK 로더 (document.write 우회)                                      */
/* ------------------------------------------------------------------ */
let sdkLoadPromise: Promise<void> | null = null;

function loadTmapSDK(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;

  if ((window as unknown as { Tmapv3?: unknown }).Tmapv3) {
    sdkLoadPromise = Promise.resolve();
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const originalWrite = document.write.bind(document);
    const captured: string[] = [];

    document.write = (...args: string[]) => {
      captured.push(args.join(""));
    };

    const loaderScript = document.createElement("script");
    loaderScript.src = `https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=${process.env.NEXT_PUBLIC_TMAP_APP_KEY}`;

    loaderScript.onload = () => {
      document.write = originalWrite;

      const html = captured.join("");
      const scriptMatches = [...html.matchAll(/src='([^']+)'/g)];
      const linkMatches = [...html.matchAll(/href='([^']+)'/g)];

      linkMatches.forEach((match) => {
        if (!document.querySelector(`link[href="${match[1]}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = match[1];
          document.head.appendChild(link);
        }
      });

      if (scriptMatches.length === 0) {
        reject(new Error("TMAP 로더에서 SDK 스크립트를 찾을 수 없습니다"));
        return;
      }

      let loaded = 0;

      scriptMatches.forEach((match) => {
        const script = document.createElement("script");
        script.src = match[1];

        script.onload = () => {
          loaded++;
          if (loaded === scriptMatches.length) resolve();
        };

        script.onerror = () =>
          reject(new Error(`SDK 로드 실패: ${match[1]}`));

        document.head.appendChild(script);
      });
    };

    loaderScript.onerror = () => {
      document.write = originalWrite;
      reject(new Error("TMAP 로더 스크립트 로드 실패"));
    };

    document.head.appendChild(loaderScript);
  });

  return sdkLoadPromise;
}

function getTmapv3(): Tmapv3Like | null {
  const w = window as unknown as { Tmapv3?: unknown };
  if (!w.Tmapv3) return null;

  const t = w.Tmapv3 as Partial<Tmapv3Like>;
  if (
    typeof t.Map !== "function" ||
    typeof t.LatLng !== "function" ||
    typeof t.Marker !== "function"
  ) {
    return null;
  }

  return t as Tmapv3Like;
}

/* ------------------------------------------------------------------ */
/*  기본 중심 좌표 (서울)                                                */
/* ------------------------------------------------------------------ */
const DEFAULT_CENTER = { lat: 37.56259379, lng: 126.99243652 };

/* ------------------------------------------------------------------ */
/*  현재위치 빨간 점 HTML                                               */
/* ------------------------------------------------------------------ */
const MY_LOCATION_DOT_HTML = `
<div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
  <span style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(239,68,68,0.25);animation:my-loc-pulse 1.5s ease-out infinite;"></span>
  <span style="width:18px;height:18px;border-radius:50%;background:#ef4444;border:3px solid #fff;box-shadow:0 0 6px rgba(0,0,0,0.35);position:relative;z-index:1;"></span>
</div>
`;

/* ------------------------------------------------------------------ */
/*  컴포넌트                                                           */
/* ------------------------------------------------------------------ */
export default function TmapMap({ heightPx = 400, fill = false, center, centerKey, myLocation, onGoToMyLocation }: TmapMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<TmapMapInst | null>(null);
  const markerRef = useRef<TmapMarkerInst | null>(null);
  const myLocMarkerRef = useRef<TmapMarkerInst | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // 1) SDK 로드 + 지도 초기 생성
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    loadTmapSDK()
      .then(() => {
        const Tmapv3 = getTmapv3();
        if (!mapRef.current || mapInstance.current || !Tmapv3) return;

        mapInstance.current = new Tmapv3.Map(mapRef.current, {
          center: new Tmapv3.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          width: "100%",
          height: fill ? "100%" : `${heightPx}px`,
          zoom: 16,
        });
        setMapReady(true);
      })
      .catch(console.error);
  }, [heightPx, fill]);

  // 좌표 캐시
  const centerLat = center?.lat;
  const centerLng = center?.lng;
  const myLat = myLocation?.lat;
  const myLng = myLocation?.lng;

  // 2) center prop 변경 → 지도 이동 + 마커 갱신 (myLocation과 같으면 마커 생략)
  useEffect(() => {
    if (!mapReady || centerLat == null || centerLng == null) return;
    if (!mapInstance.current) return;

    const Tmapv3 = getTmapv3();
    if (!Tmapv3) return;

    const pos = new Tmapv3.LatLng(centerLat, centerLng);
    mapInstance.current.setCenter(pos);

    // 기존 마커 제거
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    // 현위치와 같은 좌표면 빨간 점만 사용 (기본 마커 생략)
    const isMyLoc = myLat != null && myLng != null
      && Math.abs(centerLat - myLat) < 0.0001
      && Math.abs(centerLng - myLng) < 0.0001;

    if (!isMyLoc) {
      markerRef.current = new Tmapv3.Marker({
        position: pos,
        map: mapInstance.current,
      });
    }
  }, [mapReady, centerLat, centerLng, myLat, myLng, centerKey]);

  // 3) myLocation → 빨간 점멸 점 마커

  useEffect(() => {
    if (!mapReady || myLat == null || myLng == null) return;
    if (!mapInstance.current) return;

    const Tmapv3 = getTmapv3();
    if (!Tmapv3) return;

    // 기존 현위치 마커 제거
    if (myLocMarkerRef.current) {
      myLocMarkerRef.current.setMap(null);
    }

    const pos = new Tmapv3.LatLng(myLat, myLng);
    myLocMarkerRef.current = new Tmapv3.Marker({
      position: pos,
      map: mapInstance.current,
      iconHTML: MY_LOCATION_DOT_HTML,
    });
  }, [mapReady, myLat, myLng]);

  return (
    <div className="relative w-full h-full" style={fill ? undefined : { height: heightPx }}>
      <div
        ref={mapRef}
        className="w-full h-full"
      />

      {/* 현재위치 버튼 */}
      {onGoToMyLocation && (
        <button
          type="button"
          onClick={onGoToMyLocation}
          aria-label="현재위치로 이동"
          className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-[0.95] transition"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="1.8">
            {/* 바깥 원 */}
            <circle cx="12" cy="12" r="8" />
            {/* 중심 점 */}
            <circle cx="12" cy="12" r="1.5" fill="#1e293b" stroke="none" />
            {/* 십자선 (원을 관통) */}
            <line x1="12" y1="1" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="1" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="23" y2="12" />
          </svg>
        </button>
      )}

      {/* 빨간 점 애니메이션 키프레임 */}
      <style>{`
        @keyframes my-loc-pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
