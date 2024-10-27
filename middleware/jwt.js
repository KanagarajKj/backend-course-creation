import jwt from "jsonwebtoken";

const sign = async (user) => {
  try {
    const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";
    const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET);
    const token = jwt.sign({ userId: user._id },JWT_ACCESS_SECRET,{ expiresIn: "1d" });

    return { token, refreshToken };
  } catch (error) {
    throw new Error("Error generating tokens");
  }
};

const decode = async (token) => {
  try {
    const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

const refreshDecode = async (token) => {
  try {
    const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Refresh token verification failed");
  }
};

const refreshSign = async (user) => {
  try {
    const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
    const accessToken = jwt.sign(
      { userId: user._id },
      JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );

    return { accessToken };
  } catch (error) {
    throw new Error("Error generating access token");
  }
};

export default {
  sign,
  decode,
  refreshDecode,
  refreshSign,
};
