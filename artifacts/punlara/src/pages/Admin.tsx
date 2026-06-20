import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminListTrees, useListJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

type Tab = "journal" | "trees" | "adoptions" | "farmers";

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  adopted: "bg-blue-100 text-blue-700",
  dormant: "bg-gray-100 text-gray-500",
  active: "bg-green-100 text-green-700",
  pending_payment: "bg-amber-100 text-amber-700",
  harvested: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-600",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

function useAdminAdoptions() {
  return useQuery({
    queryKey: ["admin-adoptions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/adoptions");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<any[]>;
    },
  });
}

function useAdminFarmers() {
  return useQuery({
    queryKey: ["admin-farmers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/farmers");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<any[]>;
    },
  });
}

function usePatchAdoption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/adoptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-adoptions"] }),
  });
}

function usePatchTree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/trees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-trees"] });
      qc.invalidateQueries({ queryKey: ["trees"] });
    },
  });
}

function usePatchFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: number; status?: string; lat?: string; lng?: string }) => {
      const res = await fetch(`/api/admin/farmers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-farmers"] }),
  });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function Admin() {
  const { user, isLoading: authLoading, login } = useAuth();
  const [tab, setTab] = useState<Tab>("adoptions");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center gap-4 p-8">
        <span className="material-symbols-outlined text-6xl text-muted-foreground">lock</span>
        <h1 className="text-2xl font-bold text-primary">Admin Access Required</h1>
        <p className="text-muted-foreground text-center">Please log in to access the admin panel.</p>
        <button onClick={login} className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">Log In</button>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center gap-4 p-8">
        <span className="material-symbols-outlined text-6xl text-amber-500">shield_locked</span>
        <h1 className="text-2xl font-bold text-primary">Access Denied</h1>
        <p className="text-muted-foreground text-center">Your account doesn't have admin privileges.</p>
        <Link href="/"><button className="bg-primary text-white px-6 py-3 rounded-full font-semibold">Go Home</button></Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "adoptions", label: "Adoptions", icon: "handshake" },
    { id: "trees", label: "Trees", icon: "park" },
    { id: "farmers", label: "Farmers", icon: "person" },
    { id: "journal", label: "Journal", icon: "edit_note" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFA]">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-bold text-lg text-primary leading-tight">Punlara Admin</h1>
            <p className="text-xs text-muted-foreground">Manage trees, adoptions, farmers &amp; journals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.profileImageUrl && <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
          <span className="text-sm font-medium text-primary hidden sm:block">{user.firstName}</span>
        </div>
      </div>

      <div className="border-b border-border bg-white px-6">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {tab === "adoptions" && <AdoptionsTab />}
        {tab === "trees" && <TreesTab />}
        {tab === "farmers" && <FarmersTab />}
        {tab === "journal" && <JournalTab user={user} />}
      </div>
    </div>
  );
}

function AdoptionsTab() {
  const { data: adoptions, isLoading } = useAdminAdoptions();
  const patch = usePatchAdoption();
  const [busy, setBusy] = useState<number | null>(null);

  async function changeStatus(id: number, status: string) {
    setBusy(id);
    await patch.mutateAsync({ id, status });
    setBusy(null);
  }

  if (isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif font-bold text-xl text-primary">All Adoptions</h2>
        <span className="text-xs text-muted-foreground">{adoptions?.length ?? 0} total</span>
      </div>
      <div className="space-y-3">
        {(adoptions ?? []).map(a => (
          <div key={a.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-serif font-bold text-primary">{a.treeName}</span>
                <StatusBadge status={a.status} />
              </div>
              <div className="text-xs text-muted-foreground">
                {a.stewardName} · {a.email}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Tree: {a.tree?.name} ({a.tree?.treeCode}) · {new Date(a.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap shrink-0">
              {a.status !== "active" && (
                <ActionButton loading={busy === a.id} onClick={() => changeStatus(a.id, "active")} color="green">
                  Activate
                </ActionButton>
              )}
              {a.status !== "harvested" && (
                <ActionButton loading={busy === a.id} onClick={() => changeStatus(a.id, "harvested")} color="purple">
                  Harvested
                </ActionButton>
              )}
              {a.status !== "cancelled" && (
                <ActionButton loading={busy === a.id} onClick={() => changeStatus(a.id, "cancelled")} color="red">
                  Cancel
                </ActionButton>
              )}
            </div>
          </div>
        ))}
        {(adoptions ?? []).length === 0 && <EmptyState icon="handshake" message="No adoptions yet." />}
      </div>
    </div>
  );
}

function TreesTab() {
  const { data: trees, isLoading } = useAdminListTrees({ query: { enabled: true } });
  const patch = usePatchTree();
  const [busy, setBusy] = useState<number | null>(null);

  async function changeStatus(id: number, status: string) {
    setBusy(id);
    await patch.mutateAsync({ id, status });
    setBusy(null);
  }

  if (isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif font-bold text-xl text-primary">All Trees</h2>
        <span className="text-xs text-muted-foreground">{trees?.length ?? 0} total</span>
      </div>
      <div className="space-y-3">
        {(trees ?? []).map(t => (
          <div key={t.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
              {t.imageUrl && <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-serif font-bold text-primary">{t.name}</span>
                <StatusBadge status={t.status} />
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t.tier}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t.species} · {t.location} · <span className="font-mono">{t.treeCode}</span></div>
              <div className="text-xs text-muted-foreground mt-0.5">₱{t.pricePerYear?.toLocaleString()}/yr · {t.estimatedHarvestKg}kg est.</div>
            </div>
            <div className="flex gap-2 flex-wrap shrink-0">
              {t.status !== "available" && (
                <ActionButton loading={busy === t.id} onClick={() => changeStatus(t.id, "available")} color="green">
                  Set Available
                </ActionButton>
              )}
              {t.status !== "adopted" && (
                <ActionButton loading={busy === t.id} onClick={() => changeStatus(t.id, "adopted")} color="blue">
                  Set Adopted
                </ActionButton>
              )}
              {t.status !== "dormant" && (
                <ActionButton loading={busy === t.id} onClick={() => changeStatus(t.id, "dormant")} color="gray">
                  Set Dormant
                </ActionButton>
              )}
            </div>
          </div>
        ))}
        {(trees ?? []).length === 0 && <EmptyState icon="park" message="No trees found." />}
      </div>
    </div>
  );
}

function FarmersTab() {
  const { data: farmers, isLoading } = useAdminFarmers();
  const patch = usePatchFarmer();
  const [busy, setBusy] = useState<number | null>(null);
  const [coords, setCoords] = useState<Record<number, { lat: string; lng: string }>>({});

  async function changeStatus(id: number, status: string) {
    setBusy(id);
    await patch.mutateAsync({ id, status });
    setBusy(null);
  }

  async function saveCoords(id: number) {
    const c = coords[id];
    if (!c?.lat || !c?.lng) return;
    setBusy(id);
    await patch.mutateAsync({ id, lat: c.lat, lng: c.lng });
    setBusy(null);
    setCoords(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  if (isLoading) return <LoadingSkeleton rows={4} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif font-bold text-xl text-primary">All Farmers</h2>
        <span className="text-xs text-muted-foreground">{farmers?.length ?? 0} total</span>
      </div>
      <div className="space-y-4">
        {(farmers ?? []).map(f => (
          <div key={f.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-serif font-bold text-primary">{f.farmName}</span>
                  <StatusBadge status={f.status} />
                </div>
                <div className="text-xs text-muted-foreground">{f.farmerName} · {f.location}</div>
                {f.bio && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.bio}</div>}
                <div className="text-xs text-muted-foreground mt-1">
                  {f.treeCount} trees · Commission: {(parseFloat(f.commissionRate) * 100).toFixed(0)}%
                  {f.lat && f.lng && <span className="ml-2 text-green-600">📍 Coords set</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap shrink-0">
                {f.status !== "approved" && (
                  <ActionButton loading={busy === f.id} onClick={() => changeStatus(f.id, "approved")} color="green">
                    Approve
                  </ActionButton>
                )}
                {f.status !== "rejected" && (
                  <ActionButton loading={busy === f.id} onClick={() => changeStatus(f.id, "rejected")} color="red">
                    Reject
                  </ActionButton>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Farm Coordinates (for map)</p>
              <div className="flex gap-2 flex-wrap items-end">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Latitude</label>
                  <input
                    type="text"
                    placeholder={f.lat ?? "e.g. 7.8383"}
                    value={coords[f.id]?.lat ?? ""}
                    onChange={e => setCoords(prev => ({ ...prev, [f.id]: { ...prev[f.id], lat: e.target.value } }))}
                    className="border border-border rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Longitude</label>
                  <input
                    type="text"
                    placeholder={f.lng ?? "e.g. 123.2978"}
                    value={coords[f.id]?.lng ?? ""}
                    onChange={e => setCoords(prev => ({ ...prev, [f.id]: { ...prev[f.id], lng: e.target.value } }))}
                    className="border border-border rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  onClick={() => saveCoords(f.id)}
                  disabled={busy === f.id || !coords[f.id]?.lat || !coords[f.id]?.lng}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  {busy === f.id ? "Saving…" : "Save Coords"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {(farmers ?? []).length === 0 && <EmptyState icon="person" message="No farmer applications yet." />}
      </div>
    </div>
  );
}

function JournalTab({ user }: { user: any }) {
  const [selectedTreeId, setSelectedTreeId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", body: "", photoUrl: "", entryDate: new Date().toISOString().split("T")[0] });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: trees, isLoading: treesLoading } = useAdminListTrees({ query: { enabled: !!user?.isAdmin } });
  const { data: entries, isLoading: entriesLoading, refetch: refetchEntries } = useListJournalEntries(
    selectedTreeId ?? 0,
    { query: { enabled: !!selectedTreeId } }
  );
  const createEntry = useCreateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const selectedTree = trees?.find((t) => t.id === selectedTreeId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTreeId) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await createEntry.mutateAsync({ data: { treeId: selectedTreeId, title: form.title, body: form.body, photoUrl: form.photoUrl || undefined, entryDate: form.entryDate } });
      setForm({ title: "", body: "", photoUrl: "", entryDate: new Date().toISOString().split("T")[0] });
      setSuccessMsg("Journal entry posted!");
      refetchEntries();
    } catch {
      setErrorMsg("Failed to post entry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this journal entry?")) return;
    try {
      await deleteEntry.mutateAsync({ id });
      refetchEntries();
    } catch {
      setErrorMsg("Failed to delete entry.");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Select a Tree</h2>
        {treesLoading ? (
          <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {(trees ?? []).map((tree) => (
              <button
                key={tree.id}
                onClick={() => { setSelectedTreeId(tree.id); setSuccessMsg(""); setErrorMsg(""); }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedTreeId === tree.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white hover:border-primary/40"}`}
              >
                <div className="font-semibold text-primary text-sm leading-tight">{tree.name}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">{tree.treeCode} · {tree.tier}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-6">
        {!selectedTreeId ? (
          <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-muted-foreground mb-3">eco</span>
            <p className="text-muted-foreground font-medium">Select a tree on the left to post a journal update</p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-bold text-primary mb-1">New Entry for {selectedTree?.name}</h2>
              <p className="text-xs text-muted-foreground mb-4">This will appear on the public tree profile page</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Entry Date</label>
                  <input type="date" value={form.entryDate} onChange={e => setForm({ ...form, entryDate: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Title</label>
                  <input type="text" placeholder="e.g. First flowers of the season" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Update</label>
                  <textarea rows={4} placeholder="Write your monthly update here…" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Photo URL <span className="font-normal normal-case">(optional)</span></label>
                  <input type="url" placeholder="https://…" value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}
                {errorMsg && <p className="text-sm text-red-500 font-medium">{errorMsg}</p>}
                <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {submitting ? "Posting…" : "Post Journal Entry"}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Past Entries</h2>
              {entriesLoading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
              ) : (entries ?? []).length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">No entries yet — post the first one above.</div>
              ) : (
                <div className="space-y-3">
                  {(entries ?? []).map((entry) => (
                    <div key={entry.id} className="bg-white border border-border rounded-2xl p-5 flex gap-4">
                      {entry.photoUrl && <img src={entry.photoUrl} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-primary text-sm leading-tight">{entry.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(entry.entryDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                          <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{entry.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, color, loading }: { children: React.ReactNode; onClick: () => void; color: string; loading: boolean }) {
  const colors: Record<string, string> = {
    green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    red: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors disabled:opacity-50 ${colors[color] ?? colors.gray}`}
    >
      {loading ? "…" : children}
    </button>
  );
}

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined text-5xl text-muted-foreground mb-3">{icon}</span>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
