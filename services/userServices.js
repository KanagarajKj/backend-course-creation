import User from "../models/User.js";

const getSingleUser = async (userId) => {
  try {
    // Check if user already exists by email
    const userData = await User.findOne({ _id: userId, isActive: true });
    if (!userData) {
      return {
        message: "User Not Exists",
        code: "userNotExist",
      };
    }

    return {
      message: "Get User successfully",
      code: "getUser",
      userData,
    };
  } catch (error) {
    console.error("Error in SignUp:", error);
    return {
      message: "User registration failed",
      code: "registrationError",
      error: error.message,
    };
  }
};


export default {
  getSingleUser
};
