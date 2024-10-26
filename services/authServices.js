import User from "../models/User.js";
import jwt from "../middleware/jwt.js";
import bcrypt from "bcryptjs"; 
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SignUp = async (userName, email, password) => {
  try {
    // Check if user already exists by email
    const userData = await User.findOne({ email, isActive: true, isGoogleUser: false });
    if (userData) {
      return {
        message: "User Already Exists",
        code: "userExist",
      };
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword, // Update to hash as per the schema
      deviceLoginCount: 1,
      isActive: true,
    });

    // Save the user to the database
    const newUserData = await newUser.save();

    // Generate access and refresh tokens
    const { token, refreshToken } = await jwt.sign(newUserData);

    // Save the refresh token in the user's document
    newUserData.refreshToken = refreshToken;
    await newUserData.save();

    return {
      message: "User registered successfully",
      code: "userRegistered",
      user: newUserData, // Return the saved user with refresh token
      token,
      refreshToken,
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

const LogIn = async (email, password) => {
  try {
    // Check if user exists by email
    const userData = await User.findOne({ email, isActive: true });
    if (!userData) {
      throw {
        message: "User does not exist",
        code: "userNotFound",
      };
    }

    // Check if the device login count exceeds the limit
    if (userData.deviceLoginCount >= 3) {
      throw {
        message: "Login limit exceeded. Please contact support.",
        code: "loginLimitExceeded",
      };
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return {
        message: "Invalid password",
        code: "invalidPassword",
      };
    }

    // Generate access and refresh tokens
    const { token, refreshToken } = await jwt.sign(userData);

    // Save the refresh token in the user's document
    userData.refreshToken = refreshToken;

    // Increment the device login count
    userData.deviceLoginCount += 1;
    await userData.save();

    return {
      message: "Login successful",
      code: "loginSuccess",
      user: userData, // Return the logged-in user
      token,
      refreshToken,
    };
  } catch (error) {
    console.error("Error in LogIn:", error);
    throw {
      message: "Login failed",
      code: "loginError",
      error: error.message,
    };
  }
};

const GoogleLogIn = async (code) => {
  try {
      const ticket = await client.verifyIdToken({
      idToken: code,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    // Find or create user
    let user = await User.findOne({ googleId: sub, email, isActive: true, isGoogleUser: true });

    if (!user) {
        // Create new user
        user = new User({
            userName: name,
            email,
            imageUrl: picture,
            googleId: sub, 
            password: undefined, 
            deviceLoginCount: 1,
            isGoogleUser: true,
            isActive: true,
        });

        await user.save();

        // Generate JWT tokens
        const {token, refreshToken} = await jwt.sign(user);

        // Store refresh token hash
        user.refreshToken = refreshToken;
        await user.save();

        return {
            message: "User registered successfully",
            code: "userRegistered",
            user: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                imageUrl: user.imageUrl,
            },
            token,
            refreshToken,
        };
    }

    if (user.deviceLoginCount >= 3) {
      throw new Error("Login limit exceeded. Please contact support.");
    }

    // Generate access and refresh tokens
    const { token, refreshToken } = await jwt.sign(user);

    // Save the refresh token in the user's document
    user.refreshToken = refreshToken;

    // Increment the device login count
    user.deviceLoginCount += 1;
    await user.save();

    return {
      message: "Login successful",
      code: "loginSuccess",
      user: user,
      token,
      refreshToken,
    };

  } catch (error) {
      console.error("Error in GoogleLogIn:", error);
      throw new Error(error.message || "Authentication failed");
  }
};

const GithubLogIn = async (code) => {
    try {
        // Step 1: Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              client_id: process.env.GITHUB_CLIENT_ID,
              client_secret: process.env.GITHUB_SECRET_KEY,
              code,
            }),
        });

        const tokenData = await tokenResponse.json();
        console.log(tokenData, "tokenData");

        const accessToken = tokenData.access_token;
        console.log(accessToken, "accessToken");

        // Step 2: Fetch user data from GitHub using the access token
        const userResponse = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const userData = await userResponse.json();

        // Step 3: Extract necessary user information
        const { id, name, email, avatar_url } = userData;

        // Step 4: Find or create user in your database
        let user = await User.findOne({ githubId: id, isActive: true, isGitHubUser: true });

        if (!user) {
            // Create new user if not found
            user = new User({
              userName: name,
              email: '',
              imageUrl: avatar_url,
              githubId: id,
              password: undefined,
              deviceLoginCount: 1,
              isGitHubUser: true,
              isActive: true,
            });

            await user.save();

            // Generate JWT tokens
            const { token, refreshToken } = await jwt.sign(user);

            // Store refresh token hash
            user.refreshToken = refreshToken;
            await user.save();

            return {
                message: "User registered successfully",
                code: "userRegistered",
                user: {
                    id: user._id,
                    userName: user.userName,
                    imageUrl: user.imageUrl,
                    githubId: user.githubId,
                    isGitHubUser: user.isGitHubUser
                },
                token,
                refreshToken,
            };
        }

        if (user.deviceLoginCount >= 3) {
            throw new Error("Login limit exceeded. Please contact support.");
        }

        // Step 5: Generate access and refresh tokens for the existing user
        const { token, refreshToken } = await jwt.sign(user);

        // Save the refresh token in the user's document
        user.refreshToken = refreshToken;

        // Increment the device login count
        user.deviceLoginCount += 1;
        await user.save();

        return {
            message: "Login successful",
            code: "loginSuccess",
            user: {
                id: user._id,
                userName: user.userName,
                imageUrl: user.imageUrl,
                githubId: user.githubId,
                isGitHubUser: user.isGitHubUser
            },
            token,
            refreshToken,
        };

    } catch (error) {
        console.error("Error in GithubLogIn:", error);
        throw new Error(error.message || "Authentication failed");
    }
};

const Logout = async (logoutDevices, userId) => {
  try {
    // Check if user exists by email
    const userData = await User.findOne({ _id: userId });
    if (!userData) {
      throw {
        message: "User does not exist",
        code: "userNotFound",
      };
    }

    // Save the refresh token in the user's document
    userData.refreshToken = "";
    userData.deviceLoginCount = logoutDevices === "All" ? 0 : userData.deviceLoginCount - 1;

    await userData.save();

    return {
      message: "Logout successful",
      code: "logoutSuccess",
    };
  } catch (error) {
    console.error("Error in Logout:", error);
    throw {
      message: "Logout failed",
      code: "loginError",
      error: error.message,
    };
  }
};


const updateAccessToken= async (refreshToken) => {
  try {
    // Generate access and refresh tokens
    let payload = await jwt.refreshDecode(refreshToken);
    const userData = await User.findOne({ _id: payload?.userId, isActive: true });

    if (!userData) throw new Error("No user found in token");

    let {accessToken} = await jwt.refreshSign(userData);

    return {
      message: "Token successful",
      code: "refreshTokenSuccess",
      user: userData,
      token:accessToken,
    };
  } catch (error) {
    console.error("Error in LogIn:", error);
    return {
      message: "Rrefresh Token failed",
      code: "refreshTokenError",
      error: error.message,
    };
  }
};


export default {
  SignUp,
  LogIn,
  GoogleLogIn,
  GithubLogIn,
  Logout,
  updateAccessToken
};
