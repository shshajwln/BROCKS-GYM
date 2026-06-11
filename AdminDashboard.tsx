import Link from "next/link";
import Badge from "./Badge";

export default function Footer() {
  return (
    <footer className="grain-dark bg-basalt text-chalk">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Badge size={32} />
            <span className="font-display text-lg">BROCK&rsquo;S GYM</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-stone2/70">
            Trading card vending machines for venues across Sydney. Sealed
            product, fair prices, restocked weekly.
          </p>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-ember">
            Pages
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/locations" className="hover:text-ember">
                Find a machine
              </Link>
            </li>
            <li>
              <Link href="/partner" className="hover:text-ember">
                Host a machine
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-ember">
                Operator login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-ember">
            Contact
          </h2>
          <p className="mt-3 text-sm">
            <a href="mailto:hello@brocksgym.com.au" className="hover:text-ember">
              hello@brocksgym.com.au
            </a>
          </p>
          <p className="mt-1 text-sm text-stone2/70">Sydney, NSW</p>
        </div>
      </div>
      <div className="border-t border-slate2">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-stone2/50 md:px-6">
          &copy; {new Date().getFullYear()} Brock&rsquo;s Gym. ABN 00 000 000
          000. Brock&rsquo;s Gym is an independent vending operator and is not
          affiliated with, endorsed or sponsored by Nintendo, Creatures Inc.,
          GAME FREAK or The Pok&eacute;mon Company.
        </p>
      </div>
    </footer>
  );
}
