import { Request, Response } from "express";
import User from "../models/user.models";

// 🧠 Controller to update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const address = (req as any).user.address; // ✅ updated line
    const { name, email, avatar, bio } = req.body;

    const user = await User.findOneAndUpdate(
      { address },
      { name, email, avatar, bio },
      { new: true, upsert: false }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};


// 🧩 Optional: Get logged-in user's profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const address = (req as any).user.address;
    const user = await User.findOne({ address });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// 🧩 Optional: Get any user's profile by address
export const getUserProfileByAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ message: "Address parameter is required" });
    }

    // Case-insensitive match for wallet addresses
    const user = await User.findOne({ address: { $regex: new RegExp(`^${address}$`, "i") } });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Fetch Profile By Address Error:", error);
    res.status(500).json({
      message: "Error fetching profile",
      error: (error as Error).message,
    });
  }
};
