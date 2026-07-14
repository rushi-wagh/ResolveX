import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const profileFields = ["name", "email", "hostelId", "hostel", "block", "room"];
    const filledCount = profileFields.filter((field) => {
      const val = user[field];
      return val !== null && val !== undefined && val !== "";
    }).length;
    const percentage = Math.round((filledCount / profileFields.length) * 100);

    res.status(200).json({ success: true, data: {user, percentage} });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStaffByDepartment = async (req, res) =>{
       try {
        const {department} = req.query
        let filter = {}
        if(department){
          filter.department = department
        }
        const staff = await User.find({role: "staff", ...filter}).select("-password");
        if(!staff || staff.length === 0){
          return res.status(404).json({ success: false, message: "No staff found"});
        }
        res.status(200).json({ success: true, data: staff });
       } catch (error) {
        console.log("Error fetching staff by department:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
       }
}
