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

const priorityColor = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-600",
  Emergency: "bg-red-100 text-red-600",
};

const MyIssues = () => {
  const {
    fetchMyIssues,
    fetchAllIssues,
    myIssues = [],
    allIssues = [],
    loading,
  } = useIssueStore();

  const [activeTab, setActiveTab] = useState("my");

  useEffect(() => {
    if (activeTab === "my") fetchMyIssues();
    else fetchAllIssues({ issueType: "Public" });
  }, [activeTab]);

  const data =
    activeTab === "my"
      ? Array.isArray(myIssues)
        ? myIssues.filter(Boolean)
        : []
      : Array.isArray(allIssues)
      ? allIssues.filter(Boolean)
      : [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-sky-50 to-emerald-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Issue Dashboard
          </h1>

          <p className="text-sm text-slate-500 mb-6">
            Track and manage hostel issues in real-time
          </p>

          <div className="flex bg-white/70 backdrop-blur rounded-2xl p-1 w-fit shadow-sm mb-8">
            <button
              onClick={() => setActiveTab("my")}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition
              ${
                activeTab === "my"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Issues
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition
              ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Issues
            </button>
          </div>

          {loading && (
            <div className="text-center py-24 text-slate-500">
              Loading issues...
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-center py-24 text-slate-500">
              No issues found
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((issue) => (
              <div
                key={issue?._id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-white/40 overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
                  {issue?.image ? (
                    <img
                      src={issue.image}
                      alt={issue.title || "Issue image"}
                      className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 text-slate-400">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                        <ImageOff className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-[0.2em]">
                        No image
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

                  <span className="absolute left-3 bottom-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                    Issue Photo
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800 line-clamp-1">
                      {issue?.title || "Untitled Issue"}
                    </h3>

                    <div className="flex flex-col items-end gap-0.5">
                      {issue?.duplicateCount > 0 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                           {issue.duplicateCount} similar Issues
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        No similar Issues
                        </span>
                      )}

                      {issue?.priority === "Emergency" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white">
                          🚨 Emergency
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {issue?.description || "No description"}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4 text-xs">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        statusColor[issue?.status] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {issue?.status || "UNKNOWN"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        priorityColor[issue?.priority] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {issue?.priority || "N/A"}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {issue?.category || "Other"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full font-medium 
                      ${
                        issue?.issueType === "Public"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {issue?.issueType || "Public"}
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-slate-400">
                    {issue?.createdAt
                      ? new Date(issue.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : ""}
                  </div>
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

export default MyIssues;
