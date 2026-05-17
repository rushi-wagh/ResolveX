import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useLostFoundStore } from "../store/useLostandFoundStore";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const LostFoundItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchItemById,
    currentItem,
    loading,
    claimItem,
    getLostMatches,
  } = useLostFoundStore();

  const { toast, showToast, hideToast } = useToast();

  const [proof, setProof] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    if (id) fetchItemById(id);
  }, [id]);

  useEffect(() => {
    if (currentItem?.status === "LOST") fetchMatches();
  }, [currentItem]);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    const res = await getLostMatches(id);
    setMatches(res || []);
    setLoadingMatches(false);
  };

  const handleClaim = async () => {
    if (!proof) {
      showToast("error", "Please upload proof first");
      return;
    }

    const formData = new FormData();
    formData.append("proof", proof);

    const res = await claimItem(id, formData);

    if (res?.success) {
      showToast("success", "Claim submitted successfully");
      setTimeout(() => navigate(-1), 1200);
    } else {
      showToast("error", res?.message || "Claim failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading item...
        </div>
        <Footer />
      </>
    );
  }

  if (!currentItem) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Item not found
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-indigo-600 hover:underline"
          >
            ← Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-6 grid md:grid-cols-2 gap-8">
            <img
              src={currentItem.images?.[0] || "/placeholder.jpg"}
              alt={currentItem.title}
              className="w-full h-96 object-contain bg-slate-50 p-4 rounded-2xl"
            />

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {currentItem.title}
              </h1>

              <p className="text-slate-500 mt-3">
                {currentItem.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 text-sm">
                <Badge>{currentItem.category}</Badge>
                <Badge>{currentItem.location}</Badge>
                <StatusBadge status={currentItem.status} />
              </div>

              {/* 🔥 SMART MATCH PANEL */}
              {currentItem.status === "LOST" && (
                <div className="mt-6 border rounded-2xl p-4 bg-indigo-50/60">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    🔍 Possible Matches
                  </h3>

                  {loadingMatches && (
                    <p className="text-sm text-slate-500">
                      Finding matches...
                    </p>
                  )}

                  {!loadingMatches && matches.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No matching found items yet.
                    </p>
                  )}

                  <div className="space-y-2">
                    {matches.map((m) => (
                      <div
                        key={m.item._id}
                        onClick={() =>
                          navigate(`/lost-found/${m.item._id}`)
                        }
                        className="bg-white border rounded-xl p-3 flex justify-between items-center cursor-pointer hover:shadow transition"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {m.item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            📍 {m.item.location}
                          </p>
                        </div>

                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          {(m.confidence * 100).toFixed(0)}% match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentItem.status === "AVAILABLE" && (
                <div className="mt-8 space-y-4">
                  <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition">
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        setProof(e.target.files[0])
                      }
                    />
                    📄 Upload ownership proof
                  </label>

                  <button
                    onClick={handleClaim}
                    className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition"
                  >
                    Claim Item
                  </button>
                </div>
              )}

              {currentItem.status !== "AVAILABLE" && (
                <div className="mt-6 text-sm text-slate-500">
                  This item is already{" "}
                  {currentItem.status.toLowerCase()}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {toast && <Toast {...toast} onClose={hideToast} />}
    </>
  );
};

export default LostFoundItemDetail;

const Badge = ({ children }) => (
  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const colors = {
    AVAILABLE: "bg-emerald-100 text-emerald-600",
    CLAIMED: "bg-amber-100 text-amber-600",
    RETURNED: "bg-rose-100 text-rose-600",
    LOST: "bg-indigo-100 text-indigo-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
};
