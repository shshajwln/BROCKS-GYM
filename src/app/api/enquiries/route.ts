import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_VENUE_TYPES = [
  "bouldering_gym",
  "hobby_shop",
  "arcade",
  "cafe",
  "other",
];

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const venue_name = clean(body.venue_name, 120);
  const contact_name = clean(body.contact_name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 30);
  const suburb = clean(body.suburb, 80);
  const message = clean(body.message, 2000);
  const venue_type = clean(body.venue_type, 40) ?? "other";

  if (!venue_name || !contact_name || !email) {
    return NextResponse.json(
      { error: "Venue name, your name and email are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from("enquiries").insert({
    venue_name,
    contact_name,
    email,
    phone,
    suburb,
    message,
    venue_type: VALID_VENUE_TYPES.includes(venue_type) ? venue_type : "other",
  });

  if (error) {
    console.error("Enquiry insert failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't save your enquiry." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
