<<<<<<< HEAD
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        basalt: "#26211C",
        slate2: "#3B342D",
        granite: "#6E6258",
        stone2: "#ECE7DE",
        chalk: "#FBF9F4",
        ember: "#C97B2D",
        emberDeep: "#A35F1B",
        moss: "#6E7A4F",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      clipPath: {},
    },
  },
  plugins: [],
};
export default config;
=======
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...(options ?? {}) })
            );
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    }
  );
}
>>>>>>> 24fa1b75367676757dec59e17f0ec461318d01d6
