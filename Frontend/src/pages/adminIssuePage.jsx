import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useIssueStore } from "../store/useIssueStore";
import { ImageOff } from "lucide-react";

const statusColor = {
  OPEN: "bg-indigo-100 text-indigo-600",
  IN_PROGRESS: "bg-amber-100 text-amber-600",
  RESOLVED: "bg-emerald-100 text-emerald-600",
  ESCALATED: "bg-red-100 text-red-600",
};

const AdminIssues = () => {
  const {
    fetchAllIssues,
    updateStatus,
    allIssues = [],
    loading,
    fetchCategoryHeatmap,
    categoryHeatmap = [],
  } = useIssueStore();

  const [filters, setFilters] = useState({
    hostel: "",
    block: "",
    issueType: "",
  });

  useEffect(() => {
    fetchAllIssues(filters);
  }, [filters]);

  useEffect(() => {
    fetchCategoryHeatmap();
  }, []);

  const total = allIssues.length;
  const open = allIssues.filter((i) => i.status === "OPEN").length;
  const resolved = allIssues.filter((i) => i.status === "RESOLVED").length;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-sky-50 to-emerald-50 px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Live hostel complaint analytics & management
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <StatCard title="Total Issues" value={total} color="indigo" />
            <StatCard title="Open Issues" value={open} color="amber" />
            <StatCard title="Resolved Issues" value={resolved} color="emerald" />
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Issue Category Heatmap
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoryHeatmap.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl p-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-md hover:scale-[1.03] transition"
                >
                  <p className="text-xs text-slate-500 mb-1">
                    {item._id}
                  </p>

                  <h3 className="text-2xl font-bold text-indigo-600">
                    {item.count}
                  </h3>

                  <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min((item.count / total) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <input
              placeholder="Filter by Hostel"
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              onChange={(e) =>
                setFilters({ ...filters, hostel: e.target.value })
              }
            />

            <input
              placeholder="Filter by Block"
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              onChange={(e) =>
                setFilters({ ...filters, block: e.target.value })
              }
            />

            <select
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              onChange={(e) =>
                setFilters({ ...filters, issueType: e.target.value })
              }
            >
              <option value="">All Issue Types</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {loading && (
            <div className="text-center py-24 text-slate-500">
              Loading issues...
            </div>
          )}

          {!loading && allIssues.length === 0 && (
            <div className="text-center py-24 text-slate-500">
              No issues found
            </div>
          )}

          <div className="space-y-4">
            {allIssues.map((i) => (
              <div
                key={i._id}
                className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow-md border border-white/40 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative overflow-hidden bg-slate-100 aspect-[4/3] sm:w-40 sm:flex-none rounded-2xl">
                    {i.image ? (
                      <img
                        src={i.image}
                        alt={i.title || "Issue image"}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 text-slate-400">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                          <ImageOff className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
                          No image
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-800 break-words">
                        {i.title}
                      </h3>

                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        {i.duplicateCount > 0 ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                            {i.duplicateCount} Similar Issues
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                            No Similar Issues
                          </span>
                        )}

                        {i.priority === "Emergency" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white">
                            🚨 Emergency
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      {i.hostel} • Block {i.block} • Room {i.roomNumber}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${statusColor[i.status]}`}
                      >
                        {i.status}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        {i.category}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          i.issueType === "Public"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {i.issueType}
                      </span>
                    </div>
                  </div>

                  <select
                    value={i.status}
                    onChange={(e) => updateStatus(i._id, e.target.value)}
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none sm:self-start"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ESCALATED">ESCALATED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminIssues;

const StatCard = ({ title, value, color }) => (
  <div className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl border border-white/40 shadow-md hover:scale-[1.02] transition">
    <p className="text-xs text-slate-500">{title}</p>
    <h2 className={`text-2xl font-bold text-${color}-600`}>{value}</h2>
  </div>
);
