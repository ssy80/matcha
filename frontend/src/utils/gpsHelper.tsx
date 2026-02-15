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
    if (!("geolocation" in navigator)) {
        return null;
    }

    try {
        const permission = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
        });

        if (permission.state === "denied") {
            return null;
        }

        const location = await getCurrentPositionAsync();
        return location;

    } catch (err) {
        console.warn("Location request failed:", err);
        return null;
    }
};


const getCurrentPositionAsync = (): Promise<{
    latitude: number;
    longitude: number;
}> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => reject(err)
        );
    });
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