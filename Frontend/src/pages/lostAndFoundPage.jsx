import { useEffect, useMemo, useState } from "react";
import { ImageOff, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useLostFoundStore } from "../store/useLostandFoundStore";

const categories = [
  "All",
  "electronics",
  "documents",
  "accessories",
  "clothing",
  "others",
];

const LostFoundDashboard = () => {
  const navigate = useNavigate();
  const { items, fetchItems, loading, getLostMatches } =
    useLostFoundStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // 🔥 Smart match states
  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [items, activeCategory, search]);

  const fetchMatches = async (lostId) => {
    const res = await getLostMatches(lostId);
    setMatches(res);
    setShowModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-24">
        <Navbar />

        <div className="bg-white py-3 shadow-sm sticky top-0 z-40 pl-12 mx-auto">
          <div className="mt-3 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        

        {loading && <p className="text-center text-slate-500">Loading...</p>}

        <div className="grid grid-cols-2 gap-4 px-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/80 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                onClick={() => navigate(`/lost-found/${item._id}`)}
                className="cursor-pointer"
              >
                <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-400">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                        <ImageOff className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-[0.2em]">
                        No image
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />

                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      item.status === "AVAILABLE"
                        ? "bg-emerald-500 text-white"
                        : item.status === "CLAIMED"
                          ? "bg-amber-500 text-white"
                          : "bg-rose-500 text-white"
                    }`}
                  >
                    {item.status}
                  </span>

                      <span className="absolute left-2 bottom-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur">
                        {item.category}
                      </span>
                </div>

                    <div className="p-4 space-y-1.5">

                      <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    📍 {item.location}
                  </p>
                </div>
              </div>

              {/* 🔥 SMART MATCH BUTTON (only for LOST items) */}
              {item.status === "LOST" && (
                <button
                  onClick={() => fetchMatches(item._id)}
                  className="w-full border-t border-slate-100 text-xs py-2.5 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 transition font-medium"
                >
                  🔍 Find Matches
                </button>
              )}
            </div>
          ))}
        </div>

        {!loading && filteredItems.length === 0 && (
          <p className="text-center text-slate-500 mt-16">
            No items found
          </p>
        )}

        <button
          onClick={() => navigate("/lost-found/report")}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Report Item
        </button>
      </div>

      {/* 🔥 MATCH MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              🔍 Possible Matches
            </h3>

            {matches.length === 0 && (
              <p className="text-sm text-slate-500">
                No matching found items yet.
              </p>
            )}

            <div className="space-y-3">
              {matches.map((m) => (
                <div
                  key={m.item._id}
                  className="border rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{m.item.title}</p>
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

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default LostFoundDashboard;
