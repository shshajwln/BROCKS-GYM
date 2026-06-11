import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/AdminDashboard";
import type { Enquiry, Machine } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Operator dashboard — Brock's Gym",
};

export default async function AdminPage() {
  const supabase = createClient();

  const [{ data: enquiries }, { data: machines }, { data: userData }] =
    await Promise.all([
      supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("machines")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.auth.getUser(),
    ]);

  return (
    <AdminDashboard
      initialEnquiries={(enquiries ?? []) as Enquiry[]}
      initialMachines={(machines ?? []) as Machine[]}
      userEmail={userData.user?.email ?? ""}
    />
  );
}
