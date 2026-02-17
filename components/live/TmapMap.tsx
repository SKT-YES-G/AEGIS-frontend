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
/*  컴포넌트                                                           */
/* ------------------------------------------------------------------ */
export default function TmapMap({ heightPx = 400, fill = false, center }: TmapMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<TmapMapInst | null>(null);
  const markerRef = useRef<TmapMarkerInst | null>(null);
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

  // 2) center prop 변경 → 지도 이동 + 마커 갱신
  const centerLat = center?.lat;
  const centerLng = center?.lng;

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
    }

    // 새 마커 생성
    markerRef.current = new Tmapv3.Marker({
      position: pos,
      map: mapInstance.current,
    });
  }, [mapReady, centerLat, centerLng]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={fill ? undefined : { height: heightPx }}
    />
  );
}
