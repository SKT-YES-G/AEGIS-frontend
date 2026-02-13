"use client";

import { useEffect, useRef } from "react";

interface TmapMapProps {
  heightPx?: number;
}

/**
 * TMAP SDK 로더(vectorjs)는 document.write()로 실제 SDK를 삽입하는데,
 * Next.js <Script>는 비동기로 로딩하기 때문에 document.write()가 무시됩니다.
 * 이를 해결하기 위해 document.write를 임시 오버라이드하여
 * 로더가 삽입하려는 스크립트/CSS URL을 캡처한 뒤 동적으로 로드합니다.
 */
let sdkLoadPromise: Promise<void> | null = null;

function loadTmapSDK(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;

  if (window.Tmapv3) {
    sdkLoadPromise = Promise.resolve();
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const originalWrite = document.write.bind(document);
    const captured: string[] = [];

    // document.write 호출을 가로채서 내용을 캡처
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

      // SDK 스크립트 로드
      const total = scriptMatches.length;
      if (total === 0) {
        reject(new Error("TMAP 로더에서 SDK 스크립트를 찾을 수 없습니다"));
        return;
      }

      let loaded = 0;
      scriptMatches.forEach((match) => {
        const script = document.createElement("script");
        script.src = match[1];
        script.onload = () => {
          loaded++;
          if (loaded === total) resolve();
        };
        script.onerror = () => reject(new Error(`SDK 로드 실패: ${match[1]}`));
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

export default function TmapMap({ heightPx = 400 }: TmapMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    loadTmapSDK()
      .then(() => {
        if (!mapRef.current || mapInstance.current || !window.Tmapv3) return;

        mapInstance.current = new window.Tmapv3.Map(mapRef.current, {
          center: new window.Tmapv3.LatLng(37.56259379, 126.99243652),
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
