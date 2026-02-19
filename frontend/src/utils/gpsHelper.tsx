export const getPublicIP = async (): Promise<string | null> => {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch (err) {
        console.error("Failed to fetch IP:", err);
        return null;
    }
};

export const requestLocationPermission = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  if (!navigator.geolocation) {
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        }
    )
    );

    return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    };
  } catch (err) {
    console.warn("Location request failed:", err);
    return null;
  }
};

interface GeocodeResult {
    lat: string;
    lon: string;
}

export const geocodeLocation = async (name: string): Promise<{
    latitude: number;
    longitude: number;
} | null> => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`
        );

        const data: GeocodeResult[] = await res.json();

        if (data.length === 0) return null;

        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
        };
    } catch {
        return null;
    }
};
