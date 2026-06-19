import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/observability`, {
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data?.error === "object"
          ? data.error.message
          : data?.error || "Backend request failed";

      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach backend service" },
      { status: 503 }
    );
  }
}
