import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Reject requests from other origins.
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { detail: "Request origin not allowed." },
      { status: 403 }
    );
  }

  const response = NextResponse.json(
    { message: "Logged out successfully." },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );

  // Clear the authentication cookie.
  response.cookies.set({
    name: "mi_access_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
