
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Only accept requests from our own website.
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { detail: "Request origin not allowed." },
      { status: 403 }
    );
  }

  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Invalid request." },
      { status: 400 }
    );
  }

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.email ||
    !body.password
  ) {
    return NextResponse.json(
      { detail: "Email and password are required." },
      { status: 400 }
    );
  }

  let apiResponse: Response;

  try {
    apiResponse = await fetch(
      `${process.env.API_BASE_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );
  } catch {
    return NextResponse.json(
      { detail: "Authentication service unavailable." },
      { status: 503 }
    );
  }

  if (!apiResponse.ok) {
    return NextResponse.json(
      {
        detail:
          apiResponse.status === 401
            ? "Invalid email or password."
            : "Unable to sign in.",
      },
      {
        status: apiResponse.status === 401 ? 401 : 502,
      }
    );
  }

  const data = await apiResponse.json();

  // Return profile information, never the JWT.
  const response = NextResponse.json(
    { user: data.user },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );

  // Store the JWT in an HTTP-only cookie.
  response.cookies.set({
    name: "mi_access_token",
    value: data.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60,
  });

  return response;
}
