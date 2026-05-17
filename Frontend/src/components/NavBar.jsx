import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Toast from "./Toast";
import useToast from "../hooks/useToast";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast, showToast, hideToast } = useToast();

  const [openProfile, setOpenProfile] = useState(false);
  const [openLF, setOpenLF] = useState(false);
  const [openIssue, setOpenIssue] = useState(false);

  const profileRef = useRef(null);
  const lfRef = useRef(null);
  const issueRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setOpenProfile(false);
      if (lfRef.current && !lfRef.current.contains(e.target))
        setOpenLF(false);
      if (issueRef.current && !issueRef.current.contains(e.target))
        setOpenIssue(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    setOpenLF(false);
    setOpenIssue(false);
    showToast("success", "Logged out successfully");
    setTimeout(() => navigate("/login", { replace: true }), 500);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/40">
              RX
            </div>
            <span className="font-semibold text-lg text-slate-900">
              ResolveX
            </span>
          </Link>

          {/* Nav Items */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-8 text-sm font-medium text-slate-700">

              {/* Lost & Found */}
              <div className="relative" ref={lfRef}>
                <button
                  onClick={() => setOpenLF((p) => !p)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  Lost & Found <ChevronDown size={16} />
                </button>

                {openLF && (
                  <div className="absolute mt-3 w-52 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <NavItem
                      label="Dashboard"
                      onClick={() => {
                        setOpenLF(false);
                        navigate("/lost-found");
                      }}
                    />
                    <NavItem
                      label="Report Item"
                      onClick={() => {
                        setOpenLF(false);
                        navigate("/lost-found/report");
                      }}
                    />
                    {user?.role === "admin" && (
                      <NavItem
                        label="Admin Panel"
                        onClick={() => {
                          setOpenLF(false);
                          navigate("/lost-found/admin");
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Announcements */}
              <NavLink
                label="Announcements"
                onClick={() =>
                  navigate(
                    user?.role === "admin"
                      ? "/announcements-admin"
                      : "/announcements"
                  )
                }
              />

              {/* Issues */}
              <div className="relative" ref={issueRef}>
                <button
                  onClick={() => setOpenIssue((p) => !p)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  Issues <ChevronDown size={16} />
                </button>

                {openIssue && (
                  <div className="absolute mt-3 w-52 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    {user?.role === "student" && (
                      <>
                        <NavItem
                          label="My Issues"
                          onClick={() => {
                            setOpenIssue(false);
                            navigate("/my-issues");
                          }}
                        />
                        <NavItem
                          label="Report Issue"
                          onClick={() => {
                            setOpenIssue(false);
                            navigate("/issue");
                          }}
                        />
                      </>
                    )}

                    {user?.role === "admin" && (
                      <NavItem
                        label="Admin Issues"
                        onClick={() => {
                          setOpenIssue(false);
                          navigate("/admin-issues");
                        }}
                      />
                    )}

                    {user?.role === "staff" && (
                      <NavItem
                        label="Staff Dashboard"
                        onClick={() => {
                          setOpenIssue(false);
                          navigate("/staff-dashboard");
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile((p) => !p)}
                  className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow hover:scale-105 transition"
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <NavItem
                      label="View Profile"
                      onClick={() => {
                        setOpenProfile(false);
                        navigate("/profile");
                      }}
                    />
                    <NavItem
                      label="Edit Profile"
                      onClick={() => {
                        setOpenProfile(false);
                        navigate("/update-profile");
                      }}
                    />
                    <div className="h-px bg-slate-200 my-1" />
                    <NavItem
                      label="Logout"
                      danger
                      onClick={handleLogout}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {toast && <Toast {...toast} onClose={hideToast} />}
    </>
  );
};

const NavItem = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 rounded-xl transition
      ${danger
        ? "text-red-500 hover:bg-red-50"
        : "hover:bg-indigo-50 text-slate-700"}`}
  >
    {label}
  </button>
);

const NavLink = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="hover:text-indigo-600 transition"
  >
    {label}
  </button>
);

export default Navbar;

