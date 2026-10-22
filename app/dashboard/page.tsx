
"use client";

import { useEffect, useState } from "react";
import MapView from "./MapView";

type WeatherData = {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
};

export default function DashboardPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    async function loadUser() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          sessionStorage.removeItem("auth_token");
          window.location.href = "/";
          return;
        }

        const data = await response.json();
        setName(data.name);
      } catch {
        setName("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    }

    async function loadWeather() {
      try {
        const response = await fetch("/api/weather");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load weather.");
        }

        setWeather(data);
      } catch (error) {
        setWeatherError(
          error instanceof Error ? error.message : "Unable to load weather."
        );
      } finally {
        setWeatherLoading(false);
      }
    }

    loadUser();
    loadWeather();
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("auth_token");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-gray-800 pb-5">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
          >
            Logout
          </button>
        </header>

        <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Welcome, {name}!</h2>
          <p className="mt-2 text-gray-400">
            You are now viewing your dashboard.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="text-lg font-semibold">Weather</h3>

            {weatherLoading && (
              <p className="mt-3 text-gray-400">Loading weather...</p>
            )}

            {weatherError && (
              <p className="mt-3 text-red-400">{weatherError}</p>
            )}

            {weather && !weatherLoading && (
              <div className="mt-3 space-y-2">
                <p className="text-gray-300">
                  {weather.city}, {weather.country}
                </p>
                <p className="text-4xl font-bold">
                  {weather.temperature.toFixed(1)}°C
                </p>
                <p className="capitalize text-gray-300">
                  {weather.description}
                </p>
                <p className="text-gray-400">
                  Humidity: {weather.humidity}%
                </p>
                <p className="text-gray-400">
                  Wind speed: {weather.windSpeed} m/s
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
    <h3 className="mb-4 text-lg font-semibold">
      Map - Malaybalay City
   </h3>
   <MapView />
  </div>
        </section>
      </div>
    </main>
  );
}
