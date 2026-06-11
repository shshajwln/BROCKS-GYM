import Link from "next/link";
import StrataDivider from "@/components/StrataDivider";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

const steps = [
  {
    title: "Find a gym",
    body: "Our machines live where collectors already hang out — bouldering gyms, hobby shops and venues around Sydney.",
  },
  {
    title: "Tap your card",
    body: "Every machine takes contactless payment. No coins, no app, no account.",
  },
  {
    title: "Pull your packs",
    body: "Factory-sealed Pokémon TCG product at fair prices. What you see on the front is what drops.",
  },
];

const faqs = [
  {
    q: "Is the product genuine and sealed?",
    a: "Yes. Everything in our machines is factory-sealed, sourced from authorised Australian distributors. We never stock loose, weighed or resealed packs.",
  },
  {
    q: "What do the machines stock?",
    a: "Current-set booster packs as the staple, with rotating slots for blisters, sleeves and the occasional older set. Stock varies by machine.",
  },
  {
    q: "What if the machine takes my money and nothing drops?",
    a: "Every machine has a contact QR code on the front. Send us the machine ID and the time, and we'll refund you or credit a pack on the next restock — usually same day.",
  },
  {
    q: "Can I request a set or product?",
    a: "Yes — tell us through the contact QR on any machine. Requests genuinely shape what we order for the next restock.",
  },
];

export default async function Home() {
  let liveCount = 0;
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true })
      .eq("status", "live");
    liveCount = count ?? 0;
  } catch {
    // Supabase not configured yet — render without the counter.
  }

  return (
    <>
      {/* Hero */}
      <section className="grain-dark bg-basalt text-chalk">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
            Trading card vending &middot; Sydney
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
            BROCK&rsquo;S
            <br />
            GYM
          </h1>
          <p className="mt-6 max-w-xl text-lg text-stone2/80">
            Pokémon TCG vending machines for bouldering gyms, hobby shops and
            venues. Sealed product, fair prices, restocked weekly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/locations"
              className="bg-ember px-6 py-3 font-mono text-sm uppercase tracking-widest text-basalt transition-colors hover:bg-emberDeep hover:text-chalk"
            >
              Find a machine
            </Link>
            <Link
              href="/partner"
              className="border-2 border-stone2/40 px-6 py-3 font-mono text-sm uppercase tracking-widest text-chalk transition-colors hover:border-ember hover:text-ember"
            >
              Host a machine
            </Link>
          </div>
          {liveCount > 0 && (
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-stone2/50">
              {liveCount} machine{liveCount === 1 ? "" : "s"} live right now
            </p>
          )}
        </div>
        <StrataDivider from="#ECE7DE" />
      </section>

      {/* How it works */}
      <section className="grain bg-stone2 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="border-t-4 border-ember pt-5">
                <span
                  className="octagon inline-flex h-10 w-10 items-center justify-center bg-basalt font-mono text-sm font-bold text-chalk"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-granite">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner pitch */}
      <section className="grain-dark bg-slate2 text-chalk">
        <StrataDivider from="#ECE7DE" flip />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
              For venues
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Your floor space.
              <br />
              Our machine.
            </h2>
            <p className="mt-4 max-w-md text-stone2/80">
              A Brock&rsquo;s Gym machine costs your venue nothing. We supply
              the machine, the stock and the servicing — you take a share of
              every sale and give your regulars one more reason to come back.
            </p>
            <Link
              href="/partner"
              className="mt-8 inline-block bg-ember px-6 py-3 font-mono text-sm uppercase tracking-widest text-basalt transition-colors hover:bg-emberDeep hover:text-chalk"
            >
              Talk to us
            </Link>
          </div>
          <ul className="space-y-5 self-center">
            {[
              ["Zero cost", "No purchase, no rental, no lock-in contract."],
              ["Revenue share", "A cut of every sale, paid monthly."],
              [
                "Fully serviced",
                "We restock weekly and handle every refund and fault.",
              ],
              [
                "Small footprint",
                "Under 1 m² of floor space, standard power outlet.",
              ],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-4">
                <span
                  className="octagon mt-1 h-3 w-3 shrink-0 bg-ember"
                  aria-hidden="true"
                />
                <p>
                  <strong className="font-display font-normal">{t}.</strong>{" "}
                  <span className="text-stone2/70">{b}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <StrataDivider from="#ECE7DE" />
      </section>

      {/* FAQ */}
      <section className="grain bg-stone2 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl">
            Straight answers
          </h2>
          <div className="mt-8 divide-y divide-granite/30">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none font-display text-lg marker:content-none">
                  <span className="mr-3 font-mono text-ember group-open:hidden">
                    +
                  </span>
                  <span className="mr-3 hidden font-mono text-ember group-open:inline">
                    &minus;
                  </span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-7 text-granite">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
