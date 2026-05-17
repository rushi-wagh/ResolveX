import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useProfileStore } from "../store/useProfileStore";

const Profile = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const { profile, completion, getProfile, updateProfile } = useProfileStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    hostelId: "",
    hostel: "",
    block: "",
    room: "",
  });

  useEffect(() => {
    getProfile().then((res) => {
      if (!res.success) {
        showToast("error", res.message);
      }
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
        hostelId: profile.hostelId || "",
        hostel: profile.hostel || "",
        block: profile.block || "",
        room: profile.room || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateProfile(form);

    if (!res.success) {
      showToast("error", res.message);
      return;
    }

    showToast("success", res.message || "Profile updated successfully");
    setTimeout(() => navigate("/", { replace: true }), 700);
  };
  const hostelOptions = {
    "Sunrise Hall": ["A", "B", "C"],
    "Green View Hostel": ["A", "B"],
    "Blue Moon Residency": ["A", "B", "C", "D"],
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center bg-linear-to-br from-indigo-100 via-sky-100 to-emerald-100 px-4 py-4">
        <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.18)] border border-white/40">
          <h1 className="text-2xl font-semibold text-slate-900 text-center">
            Update Profile
          </h1>
          <p className="text-slate-500 text-sm text-center mt-1">
            Keep your hostel details up to date for better service.
          </p>

          <div className="mt-6 bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
            {/* <div
              className="radial-progress text-indigo-600"
              style={{ "--value": completion || 0 }}
            >
              {completion || 0}%
            </div> */}
            <div>
              <p className="font-semibold">Profile Completion</p>
              <p className="text-sm text-slate-500">
                Complete all details for best experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500 mb-2">
                PERSONAL INFORMATION
              </p>

              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="input input-bordered w-full h-11 pl-4 rounded-xl bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />

                <input
                  value={form.email}
                  disabled
                  className="input input-bordered w-full h-11 pl-4 rounded-xl bg-slate-100 border-slate-200 text-slate-500"
                />

                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <span className="text-sm text-slate-600">Account Role</span>
                  <span className="badge badge-primary px-4 py-3">
                    {form.role}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500 mb-2">
                HOSTEL DETAILS
              </p>

              <div className="space-y-4">
                <input
                  name="hostelId"
                  value={form.hostelId}
                  onChange={handleChange}
                  placeholder="Hostel Unique ID"
                  className="input input-bordered w-full h-11 pl-4 rounded-xl bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <select
                  name="hostel"
                  value={form.hostel}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      hostel: e.target.value,
                      block: "",
                    });
                  }}
                  className="select select-bordered w-full h-11 pl-4 rounded-xl bg-white/80 border-slate-200 
             focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                >
                  <option value="">Select Hostel</option>
                  {Object.keys(hostelOptions).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                    disabled={!form.hostel}
                    className="select select-bordered h-11 rounded-xl bg-white/80 border-slate-200 
             focus:outline-none focus:ring-2 focus:ring-indigo-300 
             transition-all disabled:bg-slate-100"
                  >
                    <option value="">Select Block</option>
                    {hostelOptions[form.hostel]?.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  <input
                    name="room"
                    value={form.room}
                    onChange={handleChange}
                    placeholder="Room No"
                    className="input input-bordered h-11 pl-4 rounded-xl bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                className="btn w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/40"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={hideToast} />}

      <Footer />
    </>
  );
};

export default Profile;
