import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "mi_access_token"
  )?.value;

  // No token: return to login.
  if (!token) {
    redirect("/login");
  }

  // Verify token with FastAPI.
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v1/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    redirect("/login");
  }

  const user = await response.json();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Meeting Intelligence Dashboard
      </h1>

      <p className="mt-4">
        Welcome, {user.first_name}!
      </p>

      <p className="mt-2">
        Email: {user.email}
      </p>

      <LogoutButton />
    </main>
  );
}
