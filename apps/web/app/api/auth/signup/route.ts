import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Accept signup requests only from our own website.
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { detail: "Request origin not allowed." },
      { status: 403 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Invalid request." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof body.first_name !== "string" ||
    typeof body.last_name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.first_name.trim() ||
    !body.last_name.trim() ||
    !body.email.trim() ||
    body.password.length < 8 ||
    body.password.length > 128
  ) {
    return NextResponse.json(
      { detail: "Please check your registration details." },
      { status: 400 }
    );
  }

  let apiResponse: Response;

  try {
    apiResponse = await fetch(
      `${process.env.API_BASE_URL}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password: body.password,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );
  } catch {
    return NextResponse.json(
      { detail: "Registration service unavailable." },
      { status: 503 }
    );
  }

  if (!apiResponse.ok) {
    if (apiResponse.status === 409) {
      return NextResponse.json(
        { detail: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (apiResponse.status === 422) {
      return NextResponse.json(
        { detail: "Please check your registration details." },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { detail: "Unable to create account." },
      { status: 502 }
    );
  }

  const data = await apiResponse.json();

  if (!data.access_token || !data.user) {
    return NextResponse.json(
      { detail: "Invalid authentication response." },
      { status: 502 }
    );
  }

  const response = NextResponse.json(
    { user: data.user },
    {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    }
  );

  // Authenticate the user immediately after registration.
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
