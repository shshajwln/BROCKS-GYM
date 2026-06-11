import type { Machine } from "@/lib/types";
import { venueTypeLabel } from "@/lib/types";

export default function MachineCard({ machine }: { machine: Machine }) {
  const live = machine.status === "live";
  return (
    <article className="border-2 border-basalt bg-chalk p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl">{machine.venue_name}</h3>
          <p className="mt-1 text-sm text-granite">
            {machine.address}, {machine.suburb}
          </p>
        </div>
        <span
          className={`octagon flex h-9 w-9 shrink-0 items-center justify-center ${
            live ? "bg-ember" : "bg-granite"
          }`}
          aria-hidden="true"
        />
      </div>
      <dl className="mt-4 space-y-1 font-mono text-xs uppercase tracking-widest">
        <div className="flex justify-between border-t border-stone2 pt-2">
          <dt className="text-granite">Status</dt>
          <dd className={live ? "text-emberDeep" : ""}>
            {live ? "Live now" : "Coming soon"}
          </dd>
        </div>
        <div className="flex justify-between border-t border-stone2 pt-2">
          <dt className="text-granite">Venue</dt>
          <dd>{venueTypeLabel(machine.venue_type)}</dd>
        </div>
        {machine.notes && (
          <div className="flex justify-between gap-4 border-t border-stone2 pt-2">
            <dt className="text-granite">Where</dt>
            <dd className="text-right normal-case tracking-normal">
              {machine.notes}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
