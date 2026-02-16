// hooks/useCurrentLocation.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Coords = {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
};

type LocationState = {
  coords: Coords | null;
  isLoading: boolean;
  error: string | null;
  permissionHint: "unknown" | "granted" | "denied" | "prompt";
  refresh: () => void;
};

function toErrorMessage(err: GeolocationPositionError) {
  // Geolocation error code mapping
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "위치 권한이 거부되었습니다. 브라우저/단말 설정에서 위치 권한을 허용해주세요.";
    case err.POSITION_UNAVAILABLE:
      return "위치 정보를 가져올 수 없습니다. GPS/네트워크 상태를 확인해주세요.";
    case err.TIMEOUT:
      return "위치 요청이 시간 초과되었습니다. 다시 시도해주세요.";
    default:
      return "위치 정보를 가져오는 중 오류가 발생했습니다.";
  }
}

/**
 * useCurrentLocation
 * - Web(Chrome/Android WebView)에서 navigator.geolocation으로 좌표 획득
 * - 현장 환경(권한 거부/시간초과/정확도 튐)을 고려해 상태를 명시적으로 제공
 */
export function useCurrentLocation(options?: {
  enableHighAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
  autoFetch?: boolean;
}): LocationState {
  const {
    enableHighAccuracy = true,
    timeoutMs = 8000,
    maximumAgeMs = 10_000,
    autoFetch = false,
  } = options ?? {};

  const [coords, setCoords] = useState<Coords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionHint, setPermissionHint] =
    useState<LocationState["permissionHint"]>("unknown");

  const mountedRef = useRef(true);

  const fetchOnce = useCallback(() => {
    setError(null);

    if (!("geolocation" in navigator)) {
      setError("이 환경에서는 위치 기능을 지원하지 않습니다.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mountedRef.current) return;

        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setIsLoading(false);
        setError(null);
        setPermissionHint("granted");
      },
      (err) => {
        if (!mountedRef.current) return;

        setIsLoading(false);
        setError(toErrorMessage(err));
        // 권한 거부일 때는 hint를 denied로
        if (err.code === err.PERMISSION_DENIED) setPermissionHint("denied");
      },
      {
        enableHighAccuracy,
        timeout: timeoutMs,
        maximumAge: maximumAgeMs,
      }
    );
  }, [enableHighAccuracy, timeoutMs, maximumAgeMs]);

  useEffect(() => {
    mountedRef.current = true;

    // 권한 상태 힌트(지원되는 브라우저에서만)
    // Permissions API는 일부 환경(WebView 등)에서 제한될 수 있어 "힌트"로만 사용
    if ("permissions" in navigator) {
    
      navigator.permissions
        .query({ name: "geolocation" })
        .then((res) => {
          if (!mountedRef.current) return;
          setPermissionHint(res.state);
          res.onchange = () => setPermissionHint(res.state);
        })
        .catch(() => {
          // ignore
        });
    }

    let frameId: number | undefined;
    if (autoFetch) {
      frameId = requestAnimationFrame(() => fetchOnce());
    }

    return () => {
      mountedRef.current = false;
      if (frameId !== undefined) cancelAnimationFrame(frameId);
    };
  }, [autoFetch, fetchOnce]);

  return useMemo(
    () => ({
      coords,
      isLoading,
      error,
      permissionHint,
      refresh: fetchOnce,
    }),
    [coords, isLoading, error, permissionHint, fetchOnce]
  );
}
