import Link from "next/link";
import MapWrapper from "@/components/MapWrapper";
import MachineCard from "@/components/MachineCard";
import { createClient } from "@/lib/supabase/server";
import type { Machine } from "@/lib/types";

export const revalidate = 300;

export const metadata = {
  title: "Find a machine — Brock's Gym",
};

export default async function LocationsPage() {
  let machines: Machine[] = [];
  let loadError = false;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .in("status", ["live", "coming_soon"])
      .order("status", { ascending: true }) // 'coming_soon' after 'live'? alphabetical: coming_soon < live, so flip below
      .order("venue_name");
    if (error) throw error;
    machines = (data ?? []).sort((a, b) =>
      a.status === b.status ? 0 : a.status === "live" ? -1 : 1
    );
  } catch {
    loadError = true;
  }

  return (
    <>
      <section className="grain-dark bg-basalt py-12 text-chalk md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
            Location finder
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Find a machine
          </h1>
          <p className="mt-4 max-w-xl text-stone2/80">
            Every Brock&rsquo;s Gym machine, live and on the way. Amber badges
            are stocked and running; grey badges are landing soon.
          </p>
        </div>
      </section>

      <section className="grain bg-stone2 py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="h-[420px] border-4 border-basalt md:h-[480px]">
            <MapWrapper machines={machines} />
          </div>

          <div className="mt-6 flex gap-6 font-mono text-xs uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="octagon h-4 w-4 bg-ember" aria-hidden="true" />
              Live now
            </span>
            <span className="flex items-center gap-2">
              <span className="octagon h-4 w-4 bg-granite" aria-hidden="true" />
              Coming soon
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>

          {machines.length === 0 && (
            <div className="mt-10 border-2 border-dashed border-granite/50 p-10 text-center">
              <p className="font-display text-xl">
                {loadError
                  ? "Machine list is unavailable right now."
                  : "First machines are landing soon."}
              </p>
              <p className="mt-2 text-granite">
                {loadError
                  ? "Try again shortly — or get in touch if it keeps happening."
                  : "Want one in your venue first? We're placing our launch machines now."}
              </p>
              <Link
                href="/partner"
                className="mt-6 inline-block bg-basalt px-6 py-3 font-mono text-sm uppercase tracking-widest text-chalk hover:bg-slate2"
              >
                Host a machine
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
