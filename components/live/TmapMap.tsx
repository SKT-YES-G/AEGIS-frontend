"use client";

import { useEffect, useRef } from "react";

interface TmapMapProps {
  heightPx?: number;
}

/**
 * 최소한의 Tmapv3 타입 정의 (필요한 것만)
 * any 사용 금지 → unknown + 명시적 생성자 타입
 */
type Tmapv3Like = {
  Map: new (
    el: HTMLElement,
    options: {
      center: unknown;
      width: string;
      height: string;
      zoom: number;
    }
  ) => unknown;
  LatLng: new (lat: number, lng: number) => unknown;
};

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

      // CSS 로드
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
  if (typeof t.Map !== "function" || typeof t.LatLng !== "function") {
    return null;
  }

  return t as Tmapv3Like;
}

export default function TmapMap({ heightPx = 400 }: TmapMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  // ✅ any 제거
  const mapInstance = useRef<unknown | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    loadTmapSDK()
      .then(() => {
        const Tmapv3 = getTmapv3();
        if (!mapRef.current || mapInstance.current || !Tmapv3) return;

        mapInstance.current = new Tmapv3.Map(mapRef.current, {
          center: new Tmapv3.LatLng(37.56259379, 126.99243652),
          width: "100%",
          height: `${heightPx}px`,
          zoom: 16,
        });
      })
      .catch(console.error);
  }, [heightPx]);

  return (
    <div
      ref={mapRef}
      className="w-full"
      style={{ height: heightPx }}
    />
  );
}