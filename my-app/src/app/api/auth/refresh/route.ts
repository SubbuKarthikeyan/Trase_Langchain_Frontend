import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const backendRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
    });

    const data = await backendRes.json();
    const response = NextResponse.json(data, { status: backendRes.status });

    const setCookieHeader = backendRes.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to refresh token with backend authentication server", details: err.message },
      { status: 500 }
    );
  }
}
