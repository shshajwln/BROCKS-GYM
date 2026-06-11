"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Badge from "./Badge";

const links = [
  { href: "/locations", label: "Find a machine" },
  { href: "/partner", label: "Host a machine" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="grain-dark sticky top-0 z-[1000] border-b-4 border-ember bg-basalt text-chalk">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Badge size={36} />
          <span className="font-display text-lg tracking-wide md:text-xl">
            BROCK&rsquo;S GYM
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-sm uppercase tracking-widest hover:text-ember ${
                pathname === l.href ? "text-ember" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="font-mono text-xs uppercase tracking-widest text-granite hover:text-chalk"
          >
            Admin
          </Link>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="font-mono text-sm uppercase tracking-widest">
            {open ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-slate2 px-4 pb-4 md:hidden"
          aria-label="Mobile"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-mono text-sm uppercase tracking-widest"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block py-3 font-mono text-xs uppercase tracking-widest text-granite"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
