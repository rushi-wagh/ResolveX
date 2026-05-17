import { useEffect } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useLostFoundStore } from "../store/useLostandFoundStore";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const AdminModerationPanel = () => {
  const { items = [], fetchItems, approveClaim, rejectClaim, loading } =
    useLostFoundStore();

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const pendingClaims = items.filter(
    (i) => i.status === "CLAIM_REQUESTED"
  );

  const handleApprove = async (id) => {
    const res = await approveClaim(id);
    res.success
      ? showToast("success", res.message || "Claim approved")
      : showToast("error", res.message || "Approval failed");
  };

  const handleReject = async (id) => {
    const res = await rejectClaim(id);
    res.success
      ? showToast("success", res.message || "Claim rejected")
      : showToast("error", res.message || "Reject failed");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-sky-50 to-emerald-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            Lost & Found Moderation
          </h1>

          <p className="text-sm text-slate-500 mb-8">
            Review and manage claim requests
          </p>

          {loading && (
            <div className="text-center py-24 text-slate-500">
              Loading claims...
            </div>
          )}

          {!loading && pendingClaims.length === 0 && (
            <div className="text-center py-24 text-slate-500">
              No claim requests pending 🎉
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingClaims.map((c) => (
              <div
                key={c._id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-white/40 overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={c.images?.[0] || "/placeholder.jpg"}
                  alt={c.title}
                  className="h-48 w-full object-contain bg-slate-50 p-2"
                />

                <div className="p-4">

                  <h3 className="font-semibold text-slate-800 line-clamp-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    📍 {c.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <Badge>{c.category}</Badge>
                    <StatusBadge />
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleApprove(c._id)}
                      className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(c._id)}
                      className="flex-1 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium shadow transition"
                    >
                      Reject
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {toast && <Toast {...toast} onClose={hideToast} />}

      <Footer />
    </>
  );
};

export default AdminModerationPanel;

const Badge = ({ children }) => (
  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs">
    {children}
  </span>
);

const StatusBadge = () => (
  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-semibold">
    Claim Requested
  </span>
);
