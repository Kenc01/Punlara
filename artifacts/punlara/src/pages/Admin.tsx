import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminListTrees, useListJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function Admin() {
  const { user, isLoading: authLoading, login } = useAuth();
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
        <p className="text-muted-foreground text-center">Your account doesn't have admin privileges.<br />Contact the farm team to request access.</p>
        <Link href="/"><button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">Go Home</button></Link>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#FAFCFA]">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-bold text-lg text-primary leading-tight">Farm Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Post monthly updates to your trees' journals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.profileImageUrl && <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
          <span className="text-sm font-medium text-primary hidden sm:block">{user.firstName}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: tree list */}
        <div className="md:col-span-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Select a Tree</h2>
          {treesLoading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(trees ?? []).map((tree) => (
                <button
                  key={tree.id}
                  onClick={() => { setSelectedTreeId(tree.id); setSuccessMsg(""); setErrorMsg(""); }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selectedTreeId === tree.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-white hover:border-primary/40"
                  }`}
                >
                  <div className="font-semibold text-primary text-sm leading-tight">{tree.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{tree.treeCode} · {tree.tier}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: journal */}
        <div className="md:col-span-2 space-y-6">
          {!selectedTreeId ? (
            <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-5xl text-muted-foreground mb-3">eco</span>
              <p className="text-muted-foreground font-medium">Select a tree on the left to post a journal update</p>
            </div>
          ) : (
            <>
              {/* Post form */}
              <div className="bg-white border border-border rounded-2xl p-6">
                <h2 className="font-bold text-primary mb-1">New Entry for {selectedTree?.name}</h2>
                <p className="text-xs text-muted-foreground mb-4">This will appear on the public tree profile page</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Entry Date</label>
                    <input
                      type="date"
                      value={form.entryDate}
                      onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. First flowers of the season"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Update</label>
                    <textarea
                      rows={4}
                      placeholder="Write your monthly update here…"
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Photo URL <span className="font-normal normal-case">(optional)</span></label>
                    <input
                      type="url"
                      placeholder="https://…"
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload a photo to any image host (e.g. Google Drive, Dropbox, Imgur) and paste the direct link here.</p>
                  </div>
                  {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}
                  {errorMsg && <p className="text-sm text-red-500 font-medium">{errorMsg}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Posting…" : "Post Journal Entry"}
                  </button>
                </form>
              </div>

              {/* Existing entries */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Past Entries</h2>
                {entriesLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : (entries ?? []).length === 0 ? (
                  <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
                    No entries yet — post the first one above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(entries ?? []).map((entry) => (
                      <div key={entry.id} className="bg-white border border-border rounded-2xl p-5 flex gap-4">
                        {entry.photoUrl && (
                          <img src={entry.photoUrl} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-primary text-sm leading-tight">{entry.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{new Date(entry.entryDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
                            </div>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                              title="Delete entry"
                            >
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
    </div>
  );
}
