import { useState } from "react";

export default function App() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setLoading(true);
    setError("");
    setLocation(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const accuracy = Math.round(position.coords.accuracy);

        navigator.geolocation.clearWatch(watchId);
        setLoading(false);

        if (accuracy > 50) {
          setError(
            `Location is not accurate enough. Accuracy is ${accuracy} meters. Try again outside or near a window.`
          );
          return;
        }

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy,
        });
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId);
        setLoading(false);

        if (error.code === 1) {
          setError("Permission Denied");
        } else if (error.code === 2) {
          setError("Location Unavailable");
        } else if (error.code === 3) {
          setError("Request Timeout");
        } else {
          setError("Unknown Error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Get Current Location</h2>

      <button
        onClick={getCurrentLocation}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Getting Location..." : "Get Location"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>
          {error}
        </p>
      )}

      {location && (
        <div style={{ marginTop: "20px" }}>
          <h3>Current Location</h3>

          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>

          <p>
            <strong>Accuracy:</strong> {location.accuracy} meters
          </p>

          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}