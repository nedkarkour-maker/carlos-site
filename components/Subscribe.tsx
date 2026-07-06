"use client";

import { useState } from "react";
import { subscribe } from "@/config/content";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus({ state: "success" });
        setEmail("");
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      const message =
        data && typeof data === "object" && "error" in data && typeof data.error === "string"
          ? data.error
          : subscribe.errorFallback;
      setStatus({ state: "error", message });
    } catch {
      setStatus({ state: "error", message: subscribe.errorFallback });
    }
  }

  return (
    <section id="subscribe" className="scroll-mt-20 bg-teal-800 text-sail">
      <div className="wrap flex flex-wrap items-center justify-between gap-[30px] py-[60px]">
        <div>
          <h2 className="font-display text-[clamp(22px,3vw,34px)] font-extrabold">
            {subscribe.title}
          </h2>
          <p className="mt-1.5 max-w-[430px] text-[15px] opacity-90">
            {subscribe.body}
          </p>
        </div>

        {status.state === "success" ? (
          <p className="font-mono text-base font-semibold" role="status">
            {subscribe.success}
          </p>
        ) : (
          <form className="flex flex-wrap items-start gap-2.5" onSubmit={onSubmit}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={subscribe.placeholder}
              disabled={status.state === "loading"}
              className="min-w-[240px] rounded-[3px] bg-white px-3.5 py-[13px] font-mono text-sm text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-red-bright disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status.state === "loading"}
              className="rounded-[2px] bg-red px-[18px] py-[13px] text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {status.state === "loading" ? subscribe.buttonBusy : subscribe.button}
            </button>
            {status.state === "error" && (
              <p className="w-full font-mono text-xs" role="alert">
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
