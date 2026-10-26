"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Registration failed.");
        return;
      }

      window.location.assign("/dashboard");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Create an Account
        </h1>

        <p className="mt-2 mb-6 text-gray-600">
          Join Meeting Intelligence
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "first_name", label: "First Name", type: "text" },
            { name: "last_name", label: "Last Name", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "password", label: "Password", type: "password" },
            { name: "confirm_password", label: "Confirm Password", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>

              <input
                id={field.name}
                type={field.type}
                required
                minLength={field.type === "password" ? 8 : undefined}
                maxLength={field.type === "password" ? 128 : undefined}
                autoComplete={
                  field.name === "email"
                    ? "email"
                    : field.type === "password"
                      ? "new-password"
                      : field.name === "first_name"
                        ? "given-name"
                        : "family-name"
                }
                value={form[field.name as keyof typeof form]}
                onChange={(e) =>
                  updateField(field.name, e.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
              />
            </div>
          ))}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 p-3 font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-700">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
