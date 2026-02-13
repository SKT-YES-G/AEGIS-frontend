// components/live/TmapMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  center: { lat: number; lng: number } | null;
  zoom?: number;
};

function makeLatLng(Tmapv2: any, lat: number, lng: number) {
  // ✅ SDK 구현 형태가 환경/버전/로딩 상태에 따라 달라질 수 있어 방어적으로 처리
  // 1) new Tmapv2.LatLng(...)
  try {
    if (typeof Tmapv2?.LatLng === "function") {
      // class/constructor일 가능성이 가장 큼
      return new Tmapv2.LatLng(lat, lng);
    }
  } catch (_) {
    // ignore
  }

  // 2) Tmapv2.LatLng(...) (팩토리 함수 형태)
  try {
    if (typeof Tmapv2?.LatLng === "function") {
      return Tmapv2.LatLng(lat, lng);
    }
  } catch (_) {
    // ignore
  }

  // 3) 혹시 LatLng가 네임스페이스로 내려오는 변형 케이스
  try {
    if (typeof Tmapv2?.LatLng?.LatLng === "function") {
      return new Tmapv2.LatLng.LatLng(lat, lng);
    }
  } catch (_) {
    // ignore
  }

  throw new Error(
    "TMAP LatLng 생성 실패: Tmapv2.LatLng 형태를 확인하세요."
  );
}

export function TmapMap({ center, zoom = 16 }: Props) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  // 1) SDK 로드
  useEffect(() => {
    const appkey = process.env.NEXT_PUBLIC_TMAP_APP_KEY;
    if (!appkey) {
      console.error("TMAP APP KEY 없음 (.env.local의 NEXT_PUBLIC_TMAP_APP_KEY 확인)");
      return;
    }

    // @ts-ignore
    if (window.Tmapv2) {
      setReady(true);
      return;
    }

    const scriptId = "tmap-jsv2-sdk";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://apis.openapi.sk.com/tmap/jsv2?version=1&appkey=${encodeURIComponent(
      appkey
    )}`;
    script.async = false;
    script.onload = () => {
      // @ts-ignore
      console.log("[TMAP] loaded:", !!window.Tmapv2, "Map:", !!window.Tmapv2?.Map);
      setReady(true);
    };
    script.onerror = () => console.error("TMAP SDK 로드 실패");
    document.head.appendChild(script);
  }, []);

  // 2) 지도 최초 생성(1회)
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    if (mapRef.current) return;

    // @ts-ignore
    const { Tmapv2 } = window;
    if (!Tmapv2?.Map) {
      console.error("Tmapv2.Map이 없습니다. SDK 로딩/키/도메인 설정을 확인하세요.");
      return;
    }

    // ✅ 디버그: 지금 LatLng가 실제로 뭐로 잡히는지 확인
    console.log("TMAP LatLng typeof:", typeof Tmapv2?.LatLng, Tmapv2?.LatLng);

    const initial = center ?? { lat: 37.5665, lng: 126.978 };
    const initialPos = makeLatLng(Tmapv2, initial.lat, initial.lng);

    mapRef.current = new Tmapv2.Map(containerRef.current, {
      center: initialPos,
      width: "100%",
      height: "100%",
      zoom,
      zoomControl: true,
    });
  }, [ready, center, zoom]);

  // 3) center 변경 시 이동 + 마커 갱신
  useEffect(() => {
    if (!ready || !center || !mapRef.current) return;

    // @ts-ignore
    const { Tmapv2 } = window;
    const pos = makeLatLng(Tmapv2, center.lat, center.lng);

    mapRef.current.setCenter(pos);

    if (!markerRef.current) {
      markerRef.current = new Tmapv2.Marker({
        position: pos,
        map: mapRef.current,
      });
    } else {
      markerRef.current.setPosition(pos);
    }
  }, [ready, center]);

  return <div ref={containerRef} className="w-full h-full" />;
}
