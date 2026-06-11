"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Enquiry, EnquiryStatus, Machine, MachineStatus } from "@/lib/types";
import { VENUE_TYPES, venueTypeLabel } from "@/lib/types";

type Tab = "enquiries" | "machines" | "stock";

const ENQUIRY_STATUSES: EnquiryStatus[] = ["new", "contacted", "closed"];
const MACHINE_STATUSES: MachineStatus[] = ["live", "coming_soon", "offline"];

const label = "block font-mono text-xs uppercase tracking-widest";
const input =
  "mt-1 w-full border-2 border-basalt bg-chalk px-3 py-2 text-sm text-basalt";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard({
  initialEnquiries,
  initialMachines,
  userEmail,
}: {
  initialEnquiries: Enquiry[];
  initialMachines: Machine[];
  userEmail: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("enquiries");
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [machines, setMachines] = useState(initialMachines);
  const [notice, setNotice] = useState("");
  const [savingMachine, setSavingMachine] = useState(false);

  function flash(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function setEnquiryStatus(id: string, status: EnquiryStatus) {
    const previous = enquiries;
    setEnquiries((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status } : r))
    );
    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id);
    if (error) {
      setEnquiries(previous);
      flash("Update failed — try again.");
    }
  }

  async function setMachineStatus(id: string, status: MachineStatus) {
    const previous = machines;
    setMachines((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status } : r))
    );
    const { error } = await supabase
      .from("machines")
      .update({ status })
      .eq("id", id);
    if (error) {
      setMachines(previous);
      flash("Update failed — try again.");
    }
  }

  async function deleteMachine(id: string) {
    if (!window.confirm("Delete this machine? This can't be undone.")) return;
    const previous = machines;
    setMachines((rows) => rows.filter((r) => r.id !== id));
    const { error } = await supabase.from("machines").delete().eq("id", id);
    if (error) {
      setMachines(previous);
      flash("Delete failed — try again.");
    }
  }

  async function addMachine(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingMachine(true);
    const form = e.currentTarget;
    const f = new FormData(form);

    const row = {
      name: String(f.get("name")),
      venue_name: String(f.get("venue_name")),
      venue_type: String(f.get("venue_type")),
      address: String(f.get("address")),
      suburb: String(f.get("suburb")),
      lat: Number(f.get("lat")),
      lng: Number(f.get("lng")),
      status: String(f.get("status")) as MachineStatus,
      notes: String(f.get("notes") || "") || null,
    };

    if (Number.isNaN(row.lat) || Number.isNaN(row.lng)) {
      flash("Latitude and longitude must be numbers.");
      setSavingMachine(false);
      return;
    }

    const { data, error } = await supabase
      .from("machines")
      .insert(row)
      .select()
      .single();

    if (error || !data) {
      flash("Couldn't add the machine — check the fields.");
    } else {
      setMachines((rows) => [data as Machine, ...rows]);
      form.reset();
      flash("Machine added.");
    }
    setSavingMachine(false);
  }

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <section className="grain min-h-[70vh] bg-stone2 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emberDeep">
              Operator dashboard
            </p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">
              The back room
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-granite">{userEmail}</p>
            <button
              onClick={signOut}
              className="mt-1 font-mono text-xs uppercase tracking-widest underline hover:text-emberDeep"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b-2 border-basalt">
          {(
            [
              ["enquiries", `Enquiries${newCount ? ` (${newCount} new)` : ""}`],
              ["machines", "Machines"],
              ["stock", "Stock"],
            ] as [Tab, string][]
          ).map(([t, l]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-widest ${
                tab === t
                  ? "bg-basalt text-chalk"
                  : "text-granite hover:text-basalt"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {notice && (
          <p className="mt-4 border-2 border-ember bg-chalk p-3 text-sm">
            {notice}
          </p>
        )}

        {/* Enquiries */}
        {tab === "enquiries" && (
          <div className="mt-6 space-y-4">
            {enquiries.length === 0 && (
              <p className="border-2 border-dashed border-granite/50 p-8 text-center text-granite">
                No enquiries yet. They'll land here when a venue fills in the
                form.
              </p>
            )}
            {enquiries.map((e) => (
              <article key={e.id} className="border-2 border-basalt bg-chalk p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl">{e.venue_name}</h2>
                    <p className="mt-1 text-sm text-granite">
                      {venueTypeLabel(e.venue_type)}
                      {e.suburb ? ` · ${e.suburb}` : ""} · {fmtDate(e.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {ENQUIRY_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setEnquiryStatus(e.id, s)}
                        className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest ${
                          e.status === s
                            ? s === "new"
                              ? "bg-ember text-basalt"
                              : s === "contacted"
                                ? "bg-moss text-chalk"
                                : "bg-granite text-chalk"
                            : "border border-granite/40 text-granite hover:border-basalt hover:text-basalt"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <dl className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="inline font-mono text-xs uppercase tracking-widest text-granite">
                      Contact:{" "}
                    </dt>
                    <dd className="inline">{e.contact_name}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-xs uppercase tracking-widest text-granite">
                      Email:{" "}
                    </dt>
                    <dd className="inline">
                      <a href={`mailto:${e.email}`} className="underline">
                        {e.email}
                      </a>
                    </dd>
                  </div>
                  {e.phone && (
                    <div>
                      <dt className="inline font-mono text-xs uppercase tracking-widest text-granite">
                        Phone:{" "}
                      </dt>
                      <dd className="inline">{e.phone}</dd>
                    </div>
                  )}
                </dl>
                {e.message && (
                  <p className="mt-3 border-l-4 border-stone2 pl-3 text-sm text-granite">
                    {e.message}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Machines */}
        {tab === "machines" && (
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              {machines.length === 0 && (
                <p className="border-2 border-dashed border-granite/50 p-8 text-center text-granite">
                  No machines yet. Add your first one with the form.
                </p>
              )}
              {machines.map((m) => (
                <article
                  key={m.id}
                  className="border-2 border-basalt bg-chalk p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg">
                        {m.name} · {m.venue_name}
                      </h2>
                      <p className="mt-1 text-sm text-granite">
                        {m.address}, {m.suburb}
                      </p>
                      <p className="mt-1 font-mono text-xs text-granite">
                        {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-1">
                        {MACHINE_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => setMachineStatus(m.id, s)}
                            className={`px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest ${
                              m.status === s
                                ? s === "live"
                                  ? "bg-ember text-basalt"
                                  : s === "coming_soon"
                                    ? "bg-granite text-chalk"
                                    : "bg-basalt text-chalk"
                                : "border border-granite/40 text-granite hover:border-basalt hover:text-basalt"
                            }`}
                          >
                            {s.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => deleteMachine(m.id)}
                        className="font-mono text-[11px] uppercase tracking-widest text-granite underline hover:text-emberDeep"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {m.notes && (
                    <p className="mt-3 text-sm text-granite">{m.notes}</p>
                  )}
                </article>
              ))}
            </div>

            <form
              onSubmit={addMachine}
              className="h-fit space-y-4 border-2 border-basalt bg-chalk p-5"
            >
              <h2 className="font-display text-xl">Add a machine</h2>
              <div>
                <label htmlFor="m-name" className={label}>
                  Machine name *
                </label>
                <input
                  id="m-name"
                  name="name"
                  required
                  className={input}
                  placeholder="Machine 03"
                />
              </div>
              <div>
                <label htmlFor="m-venue" className={label}>
                  Venue name *
                </label>
                <input id="m-venue" name="venue_name" required className={input} />
              </div>
              <div>
                <label htmlFor="m-type" className={label}>
                  Venue type *
                </label>
                <select
                  id="m-type"
                  name="venue_type"
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="m-address" className={label}>
                    Address *
                  </label>
                  <input id="m-address" name="address" required className={input} />
                </div>
                <div>
                  <label htmlFor="m-suburb" className={label}>
                    Suburb *
                  </label>
                  <input id="m-suburb" name="suburb" required className={input} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="m-lat" className={label}>
                    Latitude *
                  </label>
                  <input
                    id="m-lat"
                    name="lat"
                    required
                    className={input}
                    placeholder="-33.9046"
                  />
                </div>
                <div>
                  <label htmlFor="m-lng" className={label}>
                    Longitude *
                  </label>
                  <input
                    id="m-lng"
                    name="lng"
                    required
                    className={input}
                    placeholder="151.1936"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="m-status" className={label}>
                  Status *
                </label>
                <select
                  id="m-status"
                  name="status"
                  className={input}
                  defaultValue="coming_soon"
                >
                  {MACHINE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="m-notes" className={label}>
                  Placement notes
                </label>
                <input
                  id="m-notes"
                  name="notes"
                  className={input}
                  placeholder="Front counter, left of reception"
                />
              </div>
              <button
                type="submit"
                disabled={savingMachine}
                className="w-full bg-basalt px-6 py-3 font-mono text-sm uppercase tracking-widest text-chalk hover:bg-ember hover:text-basalt disabled:opacity-50"
              >
                {savingMachine ? "Adding…" : "Add machine"}
              </button>
              <p className="text-xs text-granite">
                Tip: right-click a spot in Google Maps to copy its latitude and
                longitude.
              </p>
            </form>
          </div>
        )}

        {/* Stock — placeholder for the future feature */}
        {tab === "stock" && (
          <div className="mt-6 border-2 border-dashed border-granite/50 p-10 text-center">
            <span
              className="octagon mx-auto block h-12 w-12 bg-granite"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-display text-2xl">
              Live stock tracking — coming later
            </h2>
            <p className="mx-auto mt-2 max-w-md text-granite">
              The <code className="font-mono text-sm">stock_items</code> table
              is already in the database, keyed to each machine. When you're
              ready to track stock per machine, the UI plugs in here with no
              schema migration.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
