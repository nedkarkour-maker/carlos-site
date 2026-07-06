import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey || !groupId) {
    console.error(
      "MailerLite is not configured — set MAILERLITE_API_KEY and MAILERLITE_GROUP_ID in .env.local",
    );
    return NextResponse.json(
      { error: "Subscriptions aren't set up yet — please try again later." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email, groups: [groupId] }),
    });

    // 201 = new subscriber, 200 = already existed and was updated — both fine.
    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    if (res.status === 422) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    console.error("MailerLite error:", res.status, await res.text());
    return NextResponse.json(
      { error: "Something went wrong — please try again later." },
      { status: 502 },
    );
  } catch (err) {
    console.error("MailerLite request failed:", err);
    return NextResponse.json(
      { error: "Something went wrong — please try again later." },
      { status: 502 },
    );
  }
}
