"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type LocationState = "idle" | "locating" | "ready" | "denied" | "unavailable";

interface LocationContextValue {
  locationState: LocationState;
  coords: { lat: number; lng: number } | null;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = useCallback(() => {
    if (locationState === "locating" || locationState === "ready") return;

    if (!("geolocation" in navigator)) {
      setLocationState("unavailable");
      return;
    }

    setLocationState("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationState("ready");
      },
      () => setLocationState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 },
    );
  }, [locationState]);

  const value = useMemo(
    () => ({ locationState, coords, requestLocation }),
    [locationState, coords, requestLocation],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within LocationProvider");
  return context;
}
