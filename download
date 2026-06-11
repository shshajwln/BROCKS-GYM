import PartnerForm from "@/components/PartnerForm";

export const metadata = {
  title: "Host a machine — Brock's Gym",
};

const terms = [
  ["Cost to venue", "$0"],
  ["Your share", "% of every sale, paid monthly"],
  ["Restocking", "Weekly, by us"],
  ["Servicing & refunds", "Handled by us, usually same day"],
  ["Floor space", "Under 1 m², standard power outlet"],
  ["Contract", "Month to month, no lock-in"],
];

export default function PartnerPage() {
  return (
    <>
      <section className="grain-dark bg-basalt py-12 text-chalk md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
            For venues
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Host a machine
          </h1>
          <p className="mt-4 max-w-xl text-stone2/80">
            A Brock&rsquo;s Gym machine turns a square metre of your floor into
            revenue and a reason for regulars to come back. Tell us about your
            venue and we&rsquo;ll come look at the space.
          </p>
        </div>
      </section>

      <section className="grain bg-stone2 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1fr_1.4fr] md:px-6">
          <aside>
            <h2 className="font-display text-2xl">The deal</h2>
            <dl className="mt-6 border-t-2 border-basalt">
              {terms.map(([t, d]) => (
                <div
                  key={t}
                  className="flex items-baseline justify-between gap-4 border-b border-granite/30 py-3"
                >
                  <dt className="font-mono text-xs uppercase tracking-widest text-granite">
                    {t}
                  </dt>
                  <dd className="text-right text-sm">{d}</dd>
                </div>
              ))}
            </dl>
          </aside>
          <div>
            <h2 className="font-display text-2xl">Tell us about your venue</h2>
            <div className="mt-6">
              <PartnerForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
