"use client";

import { useState } from "react";
import { VENUE_TYPES } from "@/lib/types";

type FormState = "idle" | "sending" | "sent" | "error";

export default function PartnerForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong.");
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border-2 border-moss bg-chalk p-8 text-center">
        <span
          className="octagon mx-auto block h-12 w-12 bg-moss"
          aria-hidden="true"
        />
        <h3 className="mt-4 font-display text-2xl">Enquiry sent</h3>
        <p className="mt-2 text-granite">
          Thanks — we read every enquiry and reply within two business days.
        </p>
      </div>
    );
  }

  const label = "block font-mono text-xs uppercase tracking-widest";
  const input =
    "mt-2 w-full border-2 border-basalt bg-chalk px-3 py-2.5 text-basalt placeholder:text-granite/60";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="venue_name" className={label}>
            Venue name *
          </label>
          <input
            id="venue_name"
            name="venue_name"
            required
            maxLength={120}
            className={input}
            placeholder="Crimp City Bouldering"
          />
        </div>
        <div>
          <label htmlFor="venue_type" className={label}>
            Venue type *
          </label>
          <select
            id="venue_type"
            name="venue_type"
            required
            className={input}
            defaultValue="bouldering_gym"
          >
            {VENUE_TYPES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact_name" className={label}>
            Your name *
          </label>
          <input
            id="contact_name"
            name="contact_name"
            required
            maxLength={120}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="suburb" className={label}>
            Suburb
          </label>
          <input id="suburb" name="suburb" maxLength={80} className={input} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={30}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Anything we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className={input}
          placeholder="Foot traffic, opening hours, where a machine could sit…"
        />
      </div>

      {state === "error" && (
        <p className="border-2 border-ember bg-chalk p-3 text-sm">
          {errorMsg} Check the required fields and try again.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="justify-self-start bg-basalt px-8 py-3 font-mono text-sm uppercase tracking-widest text-chalk transition-colors hover:bg-ember hover:text-basalt disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
