"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed. Check your details.");
        return;
      }

      sessionStorage.setItem("auth_token", data.token);
      window.location.href = "/dashboard";
    } catch {
      setMessage("Cannot connect to the server. Check if Laravel is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl border border-gray-800 bg-gray-900 p-8"
      >
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your account</p>

        <div>
          <label htmlFor="email" className="mb-2 block">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            placeholder="Enter your password"
          />
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {message && (
          <p role="status" className="break words text-sm text-blue-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Register here
          </Link>
        </p>
      </form>
    </main>
  );
}
