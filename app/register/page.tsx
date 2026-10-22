
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    if (password !== passwordConfirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setMessage(Object.values(data.errors).flat().join(" "));
        } else {
          setMessage(data.message || "Registration failed.");
        }
        return;
      }

      setMessage("Registration successful! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch {
      setMessage("Cannot connect to Laravel. Check if the server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-5 rounded-2xl border border-gray-800 bg-gray-900 p-8"
      >
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-400">Register a new account</p>

        <div>
          <label htmlFor="name" className="mb-2 block">Full Name</label>
          <input
            id="name"
            type="text"
            required
            maxLength={255}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block">Email</label>
          <input
            id="email"
            type="email"
            required
            maxLength={255}
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
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="passwordConfirmation" className="mb-2 block">
            Confirm Password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            required
            minLength={8}
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            placeholder="Enter password again"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {message && (
          <p role="status" className="break-words text-sm text-blue-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
