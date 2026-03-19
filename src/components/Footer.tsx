"use client";

import { useState, useEffect } from "react";

function formatCoord(value: number, isLat: boolean): string {
  const abs = Math.abs(value);
  const dir = isLat ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  return `${abs.toFixed(4)}° ${dir}`;
}

export default function Footer() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("unavailable");
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLocationError(null);
    };

    const onError = () => {
      setLocationError("denied");
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 60000,
      timeout: 10000,
    });

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const locationText =
    location != null
      ? `LOC: ${formatCoord(location.lat, true)}, ${formatCoord(location.lng, false)}`
      : locationError === "denied"
        ? "LOC: permission denied"
        : locationError === "unavailable"
          ? "LOC: unavailable"
          : "LOC: acquiring...";

  return (
    <footer className="bg-bg-card border-t border-terminal-white/10 py-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
            <span className="text-terminal-green text-xs font-bold tracking-wider">
              PORTFOLIO &copy; {new Date().getFullYear()}
            </span>
            <span className="text-terminal-muted/70 text-[10px] tracking-widest uppercase hidden sm:inline flex items-center gap-1">
              Designed with Google Stitch
              <span className="text-md px-1" aria-hidden="true">♥</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#hero"
              className="text-terminal-green text-xs tracking-widest hover:text-glow transition-all"
            >
              TERMINAL
            </a>
            <a
              href="#skills"
              className="text-terminal-muted text-xs tracking-widest hover:text-terminal-green transition-colors"
            >
              SYSTEM_LOG
            </a>
            <a
              href="#contact"
              className="text-terminal-muted text-xs tracking-widest hover:text-terminal-green transition-colors"
            >
              ROOT
            </a>
          </div>

          <span className="text-terminal-muted text-xs tracking-wider hidden sm:block tabular-nums">
            {locationText}
          </span>
        </div>
      </div>
    </footer>
  );
}
